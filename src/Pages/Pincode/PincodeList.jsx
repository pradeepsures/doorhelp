import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
  FiPlus,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { getPincodes, deletePincode, updatePincode } from "../../Services/pincodeService";
import { exportToExcel } from "../../utils/exportToexcel";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

export default function PincodeList() {
  const navigate = useNavigate();

  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchPincodes = async (currentPage, searchQuery, currentStatus) => {
    try {
      setLoading(true);
      const res = await getPincodes(currentPage, 10, searchQuery, currentStatus);
      if (res.success) {
        setPincodes(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        toast.error(res.message || "Failed to load pincodes");
      }
    } catch (error) {
      console.error("Error fetching pincodes:", error);
      toast.error("Failed to load pincodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPincodes(page, search, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter]);

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

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await updatePincode(id, { status: newStatus });
      if (res.success) {
        toast.success(`Pincode status updated to ${newStatus}`);
        fetchPincodes(page, search, statusFilter);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pincode?")) return;

    try {
      const res = await deletePincode(id);
      if (res.success) {
        toast.success("Pincode deleted successfully");
        fetchPincodes(page, search, statusFilter);
      } else {
        toast.error(res.message || "Failed to delete pincode");
      }
    } catch (err) {
      toast.error("Failed to delete pincode");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
    toast.success("Filters reset successfully");
  };

  const handleExport = () => {
    if (!pincodes.length) {
      toast.error("No data available to export");
      return;
    }
    const formattedData = pincodes.map((pin, index) => ({
      "Sr No": index + 1,
      Pincode: pin.pincode || "",
      Status: pin.status === "active" ? "Active" : "Inactive",
      "Created At": pin.createdAt ? formatDate(pin.createdAt) : "",
    }));
    exportToExcel(formattedData, "Pincodes_List");
    toast.success("Excel exported successfully");
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Pincodes
          </h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pincode..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm cursor-pointer"
            >
              <FiRefreshCw /> Reset
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm cursor-pointer"
            >
              <FiDownload /> Excel
            </button>

            {/* Create */}
            <button
              onClick={() => navigate("/home/pincode/create")}
              className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer"
            >
              <FiPlus /> Add Pincode
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : pincodes.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No pincodes found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Pincode</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Created Date</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pincodes.map((row, index) => {
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {row.pincode}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button
                            onClick={() => handleToggleStatus(row._id, row.status)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${row.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                          >
                            {row.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                          {formatDate(row.createdAt)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-3 text-right">
                          <div
                            ref={(el) => (menuRefs.current[row._id] = el)}
                            className="inline-block relative"
                          >
                            <button
                              onClick={() => toggleMenu(row._id)}
                              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                            >
                              <FiMoreVertical size={18} />
                            </button>

                            {openMenuId === row._id && (
                              <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl text-sm z-50 overflow-hidden text-left">
                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(`/home/pincode/edit/${row._id}`);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-blue-600 transition-colors font-medium cursor-pointer text-left"
                                  >
                                    <FiEdit size={15} /> Edit
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleDelete(row._id);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors font-medium cursor-pointer text-left"
                                  >
                                    <FiTrash2 size={15} /> Delete
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
          {!loading && pincodes.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
              <div className="text-gray-500">
                Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium cursor-pointer"
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium cursor-pointer"
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
