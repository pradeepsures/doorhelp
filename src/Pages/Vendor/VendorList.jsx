import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiMoreVertical,
  FiDownload,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { getVendors, approveVendor, rejectVendor } from "../../Services/vendorService";
import { formatDate } from "../../utils/dateFormatter";
import { exportToExcel } from "../../utils/exportToexcel";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function VendorList() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchVendors = async (currentPage, searchQuery, currentStatus, currentVerify) => {
    try {
      setLoading(true);
      const res = await getVendors(currentPage, searchQuery, currentStatus, currentVerify);
      setVendors(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendors(page, search, statusFilter, verifyFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, verifyFilter]);

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

  const handleToggleVerify = async (id, currentIsVerified) => {
    try {
      if (currentIsVerified) {
        await rejectVendor(id);
        toast.success("Vendor rejected and disabled successfully");
      } else {
        await approveVendor(id);
        toast.success("Vendor approved and verified successfully");
      }
      fetchVendors(page, search, statusFilter, verifyFilter);
    } catch (err) {
      toast.error(err.message || "Failed to update vendor verification status");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setVerifyFilter("");
    setPage(1);
    toast.success("Filters reset successfully");
  };

  const handleDownloadExcel = () => {
    if (!vendors.length) {
      toast.error("No data available to export");
      return;
    }
    const formattedData = vendors.map((item, index) => ({
      "Sr No": index + 1,
      Name: item.name || "N/A",
      Phone: item.phoneNumber || "",
      Email: item.email || "N/A",
      Experience: item.yearOfExperience ? `${item.yearOfExperience} Years` : "N/A",
      Verified: item.isVerified ? "Yes" : "No",
      Status: item.status || "inactive",
      Online: item.onlineStatus || "offline",
      "Wallet Balance": item.walletBalance || 0,
      "Created At": item.createdAt ? formatDate(item.createdAt) : "",
    }));
    exportToExcel(formattedData, "Vendors_List");
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Vendors List</h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-60 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm"
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
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Verification Filter */}
            <select
              value={verifyFilter}
              onChange={(e) => {
                setVerifyFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
            >
              <option value="">All Verifications</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
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
          ) : vendors.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No vendors found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-white text-sm uppercase">
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Image</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Vendor Info</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Wallet Balance</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Address</th>
                    <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Verify</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((row, index) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <img
                          src={row.profileImage ? `${BASE_URL}${row.profileImage}` : "https://via.placeholder.com/40x40?text=V"}
                          alt={row.name || "Vendor"}
                          className="w-10 h-10 object-cover rounded-full border border-gray-200"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=V" }}
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => handleToggleVerify(row._id, row.isVerified)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            row.isVerified ? "bg-[#0D877F]" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              row.isVerified ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
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
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 text-left">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(`/home/vendor/view/${row._id}`);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition w-full text-left font-medium"
                              >
                                <FiEye size={16} className="text-[#0D877F]" /> View details
                              </button>
                              
                              {!row.isVerified ? (
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleToggleVerify(row._id, row.isVerified);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0D877F] hover:bg-[#0D877F]/5 transition w-full text-left font-medium"
                                >
                                  <FiCheckCircle size={16} /> Verify & Approve
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleToggleVerify(row._id, row.isVerified);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left font-medium"
                                >
                                  <FiXCircle size={16} /> Reject / Disable
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
