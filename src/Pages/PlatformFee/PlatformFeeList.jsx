import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiEye,
  FiRefreshCw
} from "react-icons/fi";
import { getPlatformFees, deletePlatformFee, updatePlatformFee } from "../../Services/platformFeeService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

export default function PlatformFeeList() {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchPlatformFees = async () => {
    try {
      setLoading(true);
      const res = await getPlatformFees();
      if (res.success) {
        setFees(res.data || []);
      } else {
        toast.error(res.message || "Failed to load platform fees");
      }
    } catch (error) {
      console.error("Error fetching platform fees:", error);
      toast.error("Failed to load platform fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformFees();
  }, []);

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
      const res = await updatePlatformFee(id, { status: newStatus });
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchPlatformFees();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const res = await deletePlatformFee(id);
      if (res.success) {
        toast.success("Platform fee configuration deleted successfully");
        fetchPlatformFees();
      } else {
        toast.error(res.message || "Failed to delete configuration");
      }
    } catch (err) {
      toast.error("Failed to delete configuration");
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Fees</h1>
            <p className="text-sm text-gray-500">Configure global platform fee and GST percentages for orders</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Refresh */}
            <button
              onClick={fetchPlatformFees}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm cursor-pointer"
            >
              <FiRefreshCw /> Refresh
            </button>

            {/* Create - Hide if there is already a document */}
            {fees.length === 0 && !loading && (
              <button
                onClick={() => navigate("/home/platform-fee/create")}
                className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer"
              >
                <FiPlus /> Add Platform Fee
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : fees.length === 0 ? (
            <div className="py-20 text-center text-gray-500 animate-pulse">
              No platform fee configuration set. Please create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Platform Fee</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">GST Percentage</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Created Date</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {fees.map((row, index) => {
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-800">
                          ₹{row.platformFee.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700">
                          {row.gst}%
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
                                      navigate(`/home/platform-fee/view/${row._id}`);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors font-medium cursor-pointer text-left"
                                  >
                                    <FiEye size={15} /> View
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(`/home/platform-fee/edit/${row._id}`);
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
        </div>
      </div>
    </div>
  );
}
