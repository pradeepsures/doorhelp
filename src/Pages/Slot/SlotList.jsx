import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw
} from "react-icons/fi";
import { getSlots, deleteSlot, updateSlot } from "../../Services/slotService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

export default function SlotList() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [slotTypeFilter, setSlotTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchSlotsList = async (currentPage, filterDate, filterType, filterStatus) => {
    try {
      setLoading(true);
      const res = await getSlots(currentPage, 10, filterDate, filterType, filterStatus);
      if (res.success) {
        setSlots(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        toast.error(res.message || "Failed to load slots");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsList(page, dateFilter, slotTypeFilter, statusFilter);
  }, [page, dateFilter, slotTypeFilter, statusFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleReset = () => {
    setDateFilter("");
    setSlotTypeFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        const res = await deleteSlot(id);
        if (res.success) {
          toast.success("Slot deleted successfully");
          fetchSlotsList(page, dateFilter, slotTypeFilter, statusFilter);
        } else {
          toast.error(res.message || "Failed to delete slot");
        }
      } catch (err) {
        toast.error("Connection error");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await updateSlot(id, { status: !currentStatus });
      if (res.success) {
        toast.success("Slot status updated successfully");
        fetchSlotsList(page, dateFilter, slotTypeFilter, statusFilter);
      } else {
        toast.error(res.message || "Failed to update slot status");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Time Slots</h1>
            <p className="text-gray-500 text-sm mt-1">Manage booking slots and schedules</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 shadow-sm rounded-xl border border-gray-100 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">Filter Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
              />
            </div>

            {/* Slot Type Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">Slot Type</label>
              <select
                value={slotTypeFilter}
                onChange={(e) => {
                  setSlotTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white min-w-[130px]"
              >
                <option value="">All Types</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="flex items-end gap-2 mt-5">
              {/* Reset */}
              <button
                onClick={handleReset}
                className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm cursor-pointer h-[38px]"
              >
                <FiRefreshCw /> Reset
              </button>

              {/* Create */}
              <button
                onClick={() => navigate("/home/slot/create")}
                className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm cursor-pointer h-[38px]"
              >
                <FiPlus /> Add Slot
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : slots.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No slots found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Date</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Time Slot</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Type</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {slots.map((row, index) => {
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {formatDisplayDate(row.date)}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {row.timeSlot}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700 capitalize">
                          {row.slotType}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button
                            onClick={() => handleToggleStatus(row._id, row.status)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${row.status
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                          >
                            {row.status ? "Active" : "Inactive"}
                          </button>
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
                                      navigate(`/home/slot/edit/${row._id}`);
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
          {!loading && slots.length > 0 && (
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
