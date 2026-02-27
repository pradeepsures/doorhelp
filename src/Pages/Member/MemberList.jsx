import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiTrash2, FiMoreVertical, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToexcel";

import { getMembersList, deleteMember } from "../../Services/member";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function MembersList() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("fullName");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10;

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = { page, limit };

      if (search.trim()) {
        params[searchField] = search.trim();
      }

      const res = await getMembersList(params);

      setMembers(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, search, searchField]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await deleteMember(id);
      toast.success("Member deleted successfully");

      // Optimistic update
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete member");
      fetchMembers(); // fallback refresh
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDownloadExcel = async () => {
    try {
      const params = { page: 1, limit: 10000 };

      if (search.trim()) {
        params[searchField] = search.trim();
      }

      const res = await getMembersList(params);
      const fullData = res.data || [];

      if (!fullData.length) {
        toast.error("No data available");
        return;
      }

      const formattedData = fullData.map((item, index) => ({
        "Sr No": index + 1,
        "Full Name": item.fullName || "",
        Email: item.email || "",
        Phone: item.phoneNumber || "",
        "Company Name": item.organization?.name || "",
        "Start Date": item.startDate || "",
        "End Date": item.endDate || "",
        State: item.state || "",
        Status: item.isActive ? "Active" : "Inactive",
      }));

      exportToExcel(formattedData, "Members_List");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Members List</h1>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-[320px]">
              <select
                value={searchField}
                onChange={(e) => {
                  setSearchField(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm shadow-sm"
              >
                <option value="fullName">Full Name</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Phone</option>
              </select>

              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={`Search by ${searchField.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
                />
              </div>
            </div>
            {/* download Button */}
            <button
              onClick={handleDownloadExcel}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm whitespace-nowrap text-sm sm:text-base"
            >
              Download Excel
            </button>

            {/* Create Button */}
            <button
              onClick={() => navigate("/home/members/create")}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm whitespace-nowrap text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>+ Create Member</span>
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="py-24 text-center text-gray-500">
              <div className="text-7xl mb-4">📪</div>
              <p className="text-xl font-medium mb-2">No members found</p>
              {search && <p className="text-sm">Try adjusting your search criteria</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-18">Sr No</th>
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-50">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-120px">Full Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-50">Company Name</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider min-w-[140px]">Start Date</th> */}
                    {/* <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-40">End Date</th> */}
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-32">State</th>
                    <th className="px-6 py-3 text-left text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-28">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-bold bg-primary-gradient text-white uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {members.map((item, index) => {
                    const serialNo = (page - 1) * limit + index + 1;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-indigo-50/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
                          {serialNo}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap">
                          {item.profileImage ? (
                            <img
                              src={`${FILE_BASE_URL}/${item.profileImage}`}
                              alt={item.fullName}
                              className="h-12 w-12 object-cover rounded-full shadow-sm border border-gray-200"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=?")}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs border">
                              No Img
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-2 text-sm font-medium text-gray-900 max-w-[220px] truncate">
                          {item.fullName || "—"}<br></br>
                          <p className="text-gray-600 font-normal text-xs mt-1">
                            {item.email || "_"}
                          </p>

                          <p className="text-gray-600 font-normal text-xs">
                            <h6>{item.phoneNumber || "_"}</h6>
                          </p>
                        </td>

                        <td className="px-6 py-2 text-sm text-gray-600 truncate max-w-[240px]">
                          {item.organization.name || "—"}
                        </td>

                        {/* <td className="px-6 py-2 text-sm text-gray-600 truncate max-w-[240px]">
                          {item.startSate || "—"}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                          {item.endDate || "—"}
                        </td> */}

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                          {item.state || "—"}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${item.isActive
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div ref={(el) => (menuRefs.current[item._id] = el)} className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(item._id);
                              }}
                              className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                              <FiMoreVertical className="text-gray-600" size={18} />
                            </button>

                            {openMenuId === item._id && (
                              <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm overflow-hidden">
                                <li>
                                  <button
                                    onClick={() => {
                                      navigate(`/home/members/view/${item._id}`);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 flex items-center gap-2 text-indigo-700 font-medium"
                                  >
                                    <FiEye size={16} /> View Details
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      navigate(`/home/members/edit/${item._id}`);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 flex items-center gap-2 text-green-700 font-medium"
                                  >
                                    <FiEdit size={16} /> Edit
                                  </button>
                                </li>
                                <li className="border-t border-gray-100 my-1"></li>
                                <li>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium"
                                  >
                                    <FiTrash2 size={16} /> Delete
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
          {!loading && members.length > 0 && totalPage > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="text-gray-600 order-2 sm:order-1">
                Showing <span className="font-semibold">{members.length}</span> of{" "}
                <span className="font-semibold">{totalPage * limit}</span> members
                <span className="ml-2 text-gray-500">(Page {page} of {totalPage})</span>
              </div>

              <div className="flex gap-3 order-1 sm:order-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition disabled:cursor-not-allowed font-medium text-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  disabled={page === totalPage}
                  className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition disabled:cursor-not-allowed font-medium text-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

