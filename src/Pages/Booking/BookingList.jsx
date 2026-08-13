import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch, FiRefreshCw, FiUserPlus } from "react-icons/fi";
import { getBookings, assignVendor } from "../../Services/bookingService";
import { getVendors } from "../../Services/vendorService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

export default function BookingList() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigningBooking, setAssigningBooking] = useState(null); // booking model
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const fetchBookings = async (currentPage, searchQuery, currentStatus) => {
    try {
      setLoading(true);
      const res = await getBookings(currentPage, searchQuery, currentStatus);
      setBookings(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveVendors = async () => {
    try {
      // Fetch active vendors to allow assignment
      const res = await getVendors(1, "", "active");
      setVendors(res.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBookings(page, search, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchActiveVendors();
  }, []);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
    toast.success("Filters reset successfully");
  };

  const handleAssignVendor = async (e) => {
    e.preventDefault();
    if (!selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }

    if (assigningBooking && assigningBooking.paymentStatus !== "paid") {
      toast.error("Booking payment is not paid");
      return;
    }

    try {
      setSubmittingAssign(true);
      await assignVendor(assigningBooking.bookingId, selectedVendorId);
      toast.success("Vendor assigned successfully");
      setAssigningBooking(null);
      setSelectedVendorId("");
      fetchBookings(page, search, statusFilter);
    } catch (error) {
      console.error("Error assigning vendor:", error);
      toast.error(error.message || "Failed to assign vendor");
    } finally {
      setSubmittingAssign(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
      assigned: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-200 text-red-950",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ID, customer, vendor..."
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
              <option value="pending">Pending Payment/Assign</option>
              <option value="scheduled">Scheduled / Paid</option>
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
            >
              <FiRefreshCw /> Reset
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600 font-medium">Loading Bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-gray-500 font-medium">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-white text-sm uppercase">
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Booking ID</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Customer</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Category</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Services</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Date & Time</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Grand Total</th>
                    <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Payment</th>
                    <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Assigned Partner</th>
                    <th className="px-6 py-4 text-center font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((row, index) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {row.bookingId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{row.userId?.name || "Guest"}</span>
                          <span className="text-xs text-gray-500">{row.userId?.phoneNumber || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                        {row.items && Array.isArray(row.items)
                          ? [...new Set(row.items.map((i) => i.categoryId?.name).filter(Boolean))].join(", ") || "N/A"
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate" title={row.items && Array.isArray(row.items) ? row.items.map((i) => `${i.name || "Service"} (x${i.quantity || 1})`).join(", ") : ""}>
                          {row.items && Array.isArray(row.items) ? row.items.map((i) => `${i.name || "Service"} (x${i.quantity || 1})`).join(", ") : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{formatDate(row.date)}</span>
                          <span className="text-xs text-gray-500">{row.timeSlot} ({row.slotType})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        ₹{row.grandTotal}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(row.bookingStatus)}`}>
                          {row.bookingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {row.vendorId ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{row.vendorId.name}</span>
                            <span className="text-xs text-gray-500">{row.vendorId.phoneNumber}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-sm italic text-gray-400">Not Assigned</span>
                            {row.bookingStatus === 'scheduled' || row.bookingStatus === 'pending' || row.bookingStatus === 'declined' ? (
                              <button
                                onClick={() => {
                                  if (row.paymentStatus !== 'paid') {
                                    toast.error("Booking payment is not paid");
                                    return;
                                  }
                                  setAssigningBooking(row);
                                }}
                                className="flex items-center gap-1 text-xs text-[#0D877F] hover:text-[#0a6660] font-bold"
                              >
                                <FiUserPlus /> Assign Partner
                              </button>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/home/booking/view/${row._id}`)}
                          className="p-2 bg-gray-100 hover:bg-[#0D877F] hover:text-white rounded-full text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
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
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50 font-medium"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Vendor Modal */}
      {assigningBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Assign Partner</h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose an active professional for booking <strong>{assigningBooking.bookingId}</strong>.
            </p>

            <form onSubmit={handleAssignVendor}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Partner
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
                  required
                >
                  <option value="">-- Select Active Vendor --</option>
                  {(() => {
                    const bookingCategoryIds = assigningBooking
                      ? assigningBooking.items.map(item => (item.categoryId?._id || item.categoryId || "").toString()).filter(Boolean)
                      : [];
                    
                    const filteredVendors = vendors.filter((v) => {
                      // 1. Must be active and online
                      const isOnline = v.onlineStatus === 'online';
                      const isActive = v.status === 'active';
                      if (!isActive || !isOnline) return false;

                      // 2. Must belong to the booking category
                      const vendorCategoryIds = v.categories ? v.categories.map(cat => (cat._id || cat).toString()) : [];
                      return vendorCategoryIds.some(catId => bookingCategoryIds.includes(catId));
                    });

                    if (filteredVendors.length === 0) {
                      return <option disabled value="">No partner found</option>;
                    }

                    return filteredVendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.phoneNumber}) - {v.skills?.join(", ") || "No specific skill"}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAssigningBooking(null);
                    setSelectedVendorId("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssign}
                  className="px-5 py-2 bg-[#0D877F] hover:bg-[#0a6660] text-white rounded-lg transition text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {submittingAssign ? "Assigning..." : "Assign Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
