import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiTrash2, FiMoreVertical, FiSearch, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { getAssociationList, deleteAssociation } from "../../Services/association";

export default function AssociationsList() {
  const navigate = useNavigate();

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // for delete loading state

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("associationName");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10;

  // 3-dot menu
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
      console.error("Fetch error:", err);
      toast.error("Failed to load associations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, [page, search, searchField]);

  // Close menu when clicking outside
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
    if (!window.confirm("Are you sure you want to delete this association?")) return;

    try {
      setDeletingId(id);
      await deleteAssociation(id);
      toast.success("Association deleted successfully");
      fetchAssociations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete association");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header + Search + Create */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Associations</h1>

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
              <option value="associationName">Association Name</option>
              <option value="email">Email</option>
              <option value="phoneNumber">Phone Number</option>
              <option value="governmentRegistrationNumber">Reg. Number</option>
            </select>

            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder={`Search by ${searchField.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => navigate("/home/association/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition font-medium whitespace-nowrap"
          >
            <FiPlus size={18} /> Create Association
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading associations...</p>
          </div>
        ) : associations.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">📪</div>
            <p className="text-xl font-medium">No associations found</p>
            {search && <p className="mt-3">Try adjusting your search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-14 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="w-64 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Association Name
                  </th>
                  <th className="w-64 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="w-52 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reg. Number
                  </th>
                  <th className="w-36 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    City
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    State
                  </th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-24 px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {associations.map((item, index) => {
                  const serialNo = (page - 1) * limit + index + 1;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {serialNo}
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[240px]">
                          {item.associationName || "N/A"}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[240px]">
                        {item.email || "—"}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.phoneNumber || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[200px]">
                        {item.governmentRegistrationNumber || "—"}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.city || "—"}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.state || "—"}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${
                            item.isActive
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div ref={(el) => (menuRefs.current[item._id] = el)}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(item._id);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
                          >
                            <FiMoreVertical className="text-gray-600" size={20} />
                          </button>

                          {openMenuId === item._id && (
                            <ul className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm">
                              <li>
                                <button
                                  onClick={() => {
                                    navigate(`/home/association/view/${item._id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-blue-700 font-medium"
                                >
                                  <FiEye size={16} /> View
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    navigate(`/home/association/edit/${item._id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-green-700 font-medium"
                                >
                                  <FiEdit size={16} /> Edit
                                </button>
                              </li>
                              <li className="border-t border-gray-100 my-1"></li>
                              <li>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  disabled={deletingId === item._id}
                                  className={`w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2.5 text-red-700 font-medium ${
                                    deletingId === item._id ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                >
                                  <FiTrash2 size={16} />
                                  {deletingId === item._id ? "Deleting..." : "Delete"}
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

        {/* Pagination */}
        {!loading && associations.length > 0 && totalPage > 1 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPage}</span>
              <span className="ml-2 text-gray-500">
                ({associations.length} items)
              </span>
            </div>
            <div className="flex gap-3 order-1 sm:order-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition font-medium text-sm disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page === totalPage}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition font-medium text-sm disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}