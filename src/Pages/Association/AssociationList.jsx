import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToexcel";

import {
  getAssociationList,
  deleteAssociation,
} from "../../Services/association";
import { createLeadership } from "../../Services/leadership";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function AssociationsList() {
  const navigate = useNavigate();

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Leadership Modal States
  const [showLeadershipModal, setShowLeadershipModal] = useState(false);
  const [selectedAssociationId, setSelectedAssociationId] = useState(null);

  const [leadershipData, setLeadershipData] = useState({
    name: "",
    designation: "",
    profileImg: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("associationName");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10;

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchAssociations = async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      if (search.trim()) {
        params[searchField] = search.trim();
      }

      const res = await getAssociationList(params);

      setAssociations(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load associations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, [page, search, searchField]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this association?"))
      return;

    try {
      setDeletingId(id);
      await deleteAssociation(id);
      toast.success("Association deleted successfully");
      fetchAssociations();
    } catch (err) {
      toast.error("Failed to delete association");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleLeadershipSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", leadershipData.name);
      formData.append("designation", leadershipData.designation);
      formData.append("association", selectedAssociationId);

      if (leadershipData.profileImg) {
        formData.append("profileImg", leadershipData.profileImg);
      }

      await createLeadership(formData);

      toast.success("Leadership added successfully");

      setShowLeadershipModal(false);
      handleClearLeadershipForm();
    } catch (error) {
      toast.error("Failed to add leadership");
    }
  };


  const handleLeadershipChange = (e) => {
    const { name, value } = e.target;
    setLeadershipData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLeadershipData((prev) => ({
        ...prev,
        profileImg: file,
      }));

      setImagePreview(URL.createObjectURL(file));
    }
  };


  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setLeadershipData((prev) => ({
  //       ...prev,
  //       image: file,
  //     }));

  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const handleClearLeadershipForm = () => {
    setLeadershipData({
      name: "",
      designation: "",
      profileImg: null,
    });

    setImagePreview(null);
  };

  // ✅ Excel Download
  const handleDownloadExcel = async () => {
    try {
      const res = await getAssociationList({
        page: 1,
        limit: 10000,
      });

      const fullData = res.data || [];

      if (!fullData.length) {
        toast.error("No data available");
        return;
      }

      const formattedData = fullData.map((item, index) => ({
        "Sr No": index + 1,
        "Association Name": item.associationName || "",
        Email: item.email || "",
        Phone: item.phoneNumber || "",
        "Registration Number":
          item.governmentRegistrationNumber || "",
        City: item.city || "",
        State: item.state || "",
        Status: item.isActive ? "Active" : "Inactive",
      }));

      exportToExcel(formattedData, "Associations_List");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Associations
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm text-sm min-w-[160px]"
            >
              <option value="associationName">
                Association Name
              </option>
              <option value="email">Email</option>
              <option value="phoneNumber">Phone Number</option>
              <option value="governmentRegistrationNumber">
                Reg. Number
              </option>
            </select>

            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder={`Search by ${searchField
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Excel Button */}
          <button
            onClick={handleDownloadExcel}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow transition font-medium"
          >
            Download Excel
          </button>

          {/* Create */}
          <button
            onClick={() => navigate("/home/association/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition font-medium"
          >
            <FiPlus size={18} /> Create Association
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-20">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left bg-primary-gradient text-sm text-white font-bold uppercase">
                    Sr No
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-sm text-white font-bold uppercase">
                    Image
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-sm text-white font-bold uppercase">
                    Association Details
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-sm text-white font-bold uppercase">
                    Leadership
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-xs text-white font-bold uppercase">
                    City
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-sm text-white font-bold uppercase">
                    State
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-left text-sm text-white font-bold uppercase">
                    Status
                  </th>
                  <th className="px-4 py-4 bg-primary-gradient text-right text-sm text-white font-bold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {associations.map((item, index) => {
                  const serialNo =
                    (page - 1) * limit + index + 1;

                  return (
                    <tr key={item._id}>
                      <td className="px-4 py-2">
                        {serialNo}
                      </td>

                      {/* Image */}
                      <td className="px-4 py-2">
                        {item.profileImage ? (
                          <img
                            src={`${FILE_BASE_URL}/${item.profileImage}`}
                            alt={item.associationName}
                            className="h-12 w-12 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                            No Img
                          </div>
                        )}
                      </td>

                      {/* Details Column */}
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 max-w-[250px]">
                        {item.associationName || "—"}

                        <p className="text-gray-600 text-xs mt-1">
                          {item.email || "_"}
                        </p>

                        <p className="text-gray-600 text-xs">
                          {item.phoneNumber || "_"}
                        </p>
                      </td>

                      {/* <td className="px-4 py-2 text-sm text-gray-700">
                        {item.leaderships && item.leaderships.length > 0 ? (
                          <div className="space-y-1">
                            {item.leaderships.map((leader) => (
                              <div key={leader._id} className="text-xs">
                                <span className="font-medium">
                                  {leader.name}
                                </span>
                                <br></br>
                                {leader.designation || "_"}
                            
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No Leadership
                          </span>
                        )}
                      </td> */}

                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.leaderships && item.leaderships.length > 0 ? (
                          <div className="text-xs">
                            {/* Show First Leader */}
                            <div>
                              <span className="font-medium">
                                {item.leaderships[0].name}
                              </span>
                              <br />
                              {item.leaderships[0].designation || "_"}
                            </div>

                            {/* If More Than 1 Show ... */}
                            {item.leaderships.length > 1 && (
                              <div className="text-gray-400 mt-1">
                                ...more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No Leadership
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.city || "—"}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.state || "—"}
                      </td>

                      <td className="px-4 py-2">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* 3 Dot Action */}
                      <td className="px-4 py-2 text-right relative">
                        <div
                          ref={(el) =>
                            (menuRefs.current[item._id] = el)
                          }
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(item._id);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <FiMoreVertical />
                          </button>

                          {openMenuId === item._id && (
                            <ul className="absolute right-0 mt-2 w-40 bg-white  shadow-lg z-50">

                              <li>
                                <button
                                  onClick={() => {
                                    setSelectedAssociationId(item._id);
                                    setShowLeadershipModal(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiPlus size={14} />Leadership
                                </button>
                              </li>

                              <li>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/home/association/view/${item._id}`
                                    )
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiEye size={14} /> View
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/home/association/edit/${item._id}`
                                    )
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiEdit size={14} /> Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleDelete(item._id)
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                  <FiTrash2 size={14} /> Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* popup */}
        {showLeadershipModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-200 w-full max-w-2xl rounded-xl shadow-lg p-6 relative">

              {/* Header */}
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Add Leadership
              </h2>

              {/* Form */}
              <form onSubmit={handleLeadershipSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Left Column */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={leadershipData.name}
                      onChange={handleLeadershipChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <select
                      name="designation"
                      value={leadershipData.designation}
                      onChange={handleLeadershipChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Designation</option>
                      <option value="President">President</option>
                      <option value="Vice-President">Vice-President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                    </select>
                  </div>
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                      required
                    />

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-3 h-24 w-24 rounded-full object-cover border"
                      />
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClearLeadershipForm}
                    className="px-4 py-2 bg-gray-900 text-white text-sm  rounded-lg hover:bg-gray-600"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLeadershipModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>

                {/* <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLeadershipModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        )}


        {/* Pagination */}
        {!loading && associations.length > 0 && totalPage > 1 && (
          <div className="px-6 py-4 flex justify-between border-t bg-gray-50">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
              className="px-4 py-2 border rounded"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPage, p + 1)
                )
              }
              disabled={page === totalPage}
              className="px-4 py-2 border rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
