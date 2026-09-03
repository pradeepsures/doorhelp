import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiEye,
  FiRefreshCw,
  FiGift,
  FiUsers,
  FiAward
} from "react-icons/fi";
import {
  getReferAndEarnList,
  deleteReferAndEarn,
  updateReferAndEarn
} from "../../Services/referAndEarnService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

export default function ReferAndEarnList() {
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchReferAndEarn = async () => {
    try {
      setLoading(true);
      const res = await getReferAndEarnList();
      if (res.success) {
        setReferrals(res.data || []);
      } else {
        toast.error(res.message || "Failed to load Refer & Earn settings");
      }
    } catch (error) {
      console.error("Error fetching Refer & Earn settings:", error);
      toast.error("Failed to load Refer & Earn settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferAndEarn();
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
      const res = await updateReferAndEarn(id, { status: newStatus });
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchReferAndEarn();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Refer & Earn configuration?")) return;

    try {
      const res = await deleteReferAndEarn(id);
      if (res.success) {
        toast.success("Refer & Earn configuration deleted successfully");
        fetchReferAndEarn();
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

  const currentConfig = referrals.length > 0 ? referrals[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Refer & Earn</h1>
            <p className="text-sm text-gray-500">Configure reward bonuses and rules for user referrals</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Refresh */}
            <button
              onClick={fetchReferAndEarn}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm cursor-pointer"
            >
              <FiRefreshCw /> Refresh
            </button>

            {/* Create - Hide if there is already a configuration */}
            {referrals.length === 0 && !loading && (
              <button
                onClick={() => navigate("/home/refer-and-earn/create")}
                className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer"
              >
                <FiPlus /> Configure Refer & Earn
              </button>
            )}

            {/* Quick Edit if config exists */}
            {referrals.length > 0 && !loading && (
              <button
                onClick={() => navigate(`/home/refer-and-earn/edit/${referrals[0]._id}`)}
                className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer"
              >
                <FiEdit /> Edit Configuration
              </button>
            )}
          </div>
        </div>

        {/* Highlight Summary Cards (when config exists) */}
        {!loading && currentConfig && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#0D877F]">
                <FiAward size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrer Bonus</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{currentConfig.referrerBonus}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Credited to the sharing user</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred User Bonus</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{currentConfig.referredUserBonus}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Credited to the newly joined user</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <FiGift size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Program Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      currentConfig.status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  <span className="text-lg font-bold text-gray-900 capitalize">
                    {currentConfig.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {currentConfig.status === "active" ? "Referrals are active" : "Referral program paused"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : referrals.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <FiGift className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-lg font-medium text-gray-700">No Refer & Earn configuration set</p>
              <p className="text-sm text-gray-400 mt-1">Click the button below to set up your referral bonus system</p>
              <button
                onClick={() => navigate("/home/refer-and-earn/create")}
                className="mt-4 px-5 py-2 inline-flex items-center gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer"
              >
                <FiPlus /> Configure Refer & Earn
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Program Title</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Referrer Bonus</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Referred User Bonus</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Created Date</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {referrals.map((row, index) => {
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-800">
                          {row.title || "Refer and Earn"}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-[#0D877F]">
                          ₹{row.referrerBonus}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-blue-600">
                          ₹{row.referredUserBonus}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button
                            onClick={() => handleToggleStatus(row._id, row.status)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                              row.status === "active"
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
                                      navigate(`/home/refer-and-earn/view/${row._id}`);
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
                                      navigate(`/home/refer-and-earn/edit/${row._id}`);
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
