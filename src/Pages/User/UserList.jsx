import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiMoreVertical,
  FiDownload
} from "react-icons/fi";
import { getUsers } from "../../Services/userService";
import { formatDate } from "../../utils/dateFormatter";
import { exportToExcel } from "../../utils/exportToexcel";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletedFilter, setDeletedFilter] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchUsers = async (currentPage, searchQuery, currentStatus, currentDeleted) => {
    try {
      setLoading(true);
      const res = await getUsers(currentPage, searchQuery, currentStatus, currentDeleted);
      setUsers(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(page, search, statusFilter, deletedFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, deletedFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        const currentMenu = menuRefs.current[openMenuId];
        if (currentMenu && !currentMenu.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setDeletedFilter("");
    setPage(1);
    toast.success("Filter reset successfully");
  };

  const handleDownloadExcel = () => {
    if (!users.length) {
      toast.error("No data available to export");
      return;
    }
    const formattedData = users.map((item, index) => ({
      "Sr No": index + 1,
      Name: item.name || "N/A",
      Phone: item.phoneNumber || "",
      Email: item.email || "N/A",
      Gender: item.gender || "N/A",
      Status: item.status ? "Active" : "Inactive",
      Deleted: item.isDeleted ? "Yes" : "No",
      Role: item.role || "user",
      "Created At": item.createdAt ? formatDate(item.createdAt) : "",
    }));
    exportToExcel(formattedData, "Users_List");
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white text-gray-700 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Deleted Filter */}
            <select
              value={deletedFilter}
              onChange={(e) => {
                setDeletedFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white text-gray-700 font-medium"
            >
              <option value="">Deleted</option>
              <option value="false">False</option>
              <option value="true">True</option>
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
            >
              <FiRefreshCw /> Reset
            </button>

            {/* Excel Export */}
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              <FiDownload /> Excel
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No users found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="text-white text-sm uppercase">
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Image</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">User Info</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Wallet Balance</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Address</th>
                      <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Joined Date</th>
                      <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((row, index) => (
                      <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <img
                            src={row.profileImage ? `${BASE_URL}${row.profileImage}` : "https://via.placeholder.com/40x40?text=U"}
                            alt={row.name || "User"}
                            className="w-10 h-10 object-cover rounded-full border border-gray-200"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=U" }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{row.name || "N/A"}</span>
                            <span className="text-xs text-gray-500">{row.email || "N/A"}</span>
                            <span className="text-xs text-gray-500">{row.phoneNumber || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                          ₹{row.walletBalance !== undefined ? row.walletBalance : 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={row.address || "N/A"}>
                          {row.address || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {row.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right overflow-visible">
                          <div
                            ref={(el) => (menuRefs.current[row._id] = el)}
                            className="inline-block relative"
                          >
                            <button
                              onClick={() => toggleMenu(row._id)}
                              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                            >
                              <FiMoreVertical size={18} />
                            </button>
                            {openMenuId === row._id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 text-left">
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    navigate(`/home/user/view/${row._id}`);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition w-full text-left font-medium"
                                >
                                  <FiEye size={16} className="text-[#0D877F]" /> View details
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card Grid View */}
              <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {users.map((row, index) => (
                  <div key={row._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 relative hover:border-[#0D877F] transition-all">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                      <img
                        src={row.profileImage ? `${BASE_URL}${row.profileImage}` : "https://via.placeholder.com/50x50?text=U"}
                        alt={row.name || "User"}
                        className="w-12 h-12 object-cover rounded-full border border-gray-200"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/50x50?text=U" }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400 font-semibold uppercase block">#{ (page - 1) * 10 + index + 1 }</span>
                        <h4 className="font-bold text-gray-800 truncate text-sm leading-snug">{row.name || "N/A"}</h4>
                        <span className="text-xs text-gray-500 block truncate">{row.email || "N/A"}</span>
                        <span className="text-xs text-gray-500 block">{row.phoneNumber || "N/A"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <strong className="text-gray-500 uppercase text-[9px] block">Wallet Balance</strong>
                          <span className="text-sm font-bold text-[#0D877F]">₹{row.walletBalance !== undefined ? row.walletBalance : 0}</span>
                        </div>
                        <div>
                          <strong className="text-gray-500 uppercase text-[9px] block">Status</strong>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${row.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {row.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-gray-500 uppercase text-[9px] block">Address</strong>
                        <span className="text-xs font-medium text-gray-700 block line-clamp-2" title={row.address || "N/A"}>
                          {row.address || "N/A"}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div>
                          <strong className="text-gray-500 uppercase text-[9px] block">Joined Date</strong>
                          <span className="text-xs font-medium text-gray-700 block">{formatDate(row.createdAt)}</span>
                        </div>

                        {/* Action buttons directly accessible on mobile */}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => navigate(`/home/user/view/${row._id}`)}
                            className="p-2.5 bg-gray-50 hover:bg-[#0D877F] hover:text-white rounded-full text-gray-600 transition shadow-sm border border-gray-200/50"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
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
