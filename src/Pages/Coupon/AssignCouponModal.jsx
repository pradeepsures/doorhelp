import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSearch,
  FiUser,
  FiCheck,
  FiUsers,
  FiTag,
  FiBell,
  FiRefreshCw
} from "react-icons/fi";
import { getUsers } from "../../Services/userService";
import { assignCoupon } from "../../Services/couponService";
import toast from "react-hot-toast";

export default function AssignCouponModal({
  isOpen,
  onClose,
  coupon,
  onAssigned
}) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [sendNotification, setSendNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Extract already assigned user IDs from coupon
  const alreadyAssignedIds = new Set(
    (coupon?.assignedUsers || []).map((u) => (typeof u === "object" ? u._id : u))
  );

  useEffect(() => {
    if (isOpen) {
      fetchUsers("");
      setSelectedUserIds(new Set());
      setSendNotification(true);
      setSearch("");
    }
  }, [isOpen, coupon]);

  const fetchUsers = async (searchQuery = "") => {
    try {
      setLoadingUsers(true);
      // Fetch active users (status = "true", isDeleted = "false")
      const res = await getUsers(1, searchQuery, "true", "false");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error(err.message || "Failed to load active users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
  };

  // Debounce search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchUsers(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Toggle individual user
  const handleToggleUser = (userId) => {
    const next = new Set(selectedUserIds);
    if (next.has(userId)) {
      next.delete(userId);
    } else {
      next.add(userId);
    }
    setSelectedUserIds(next);
  };

  // Select all non-assigned or all visible
  const handleSelectAll = () => {
    const unassignedVisible = users.filter((u) => !alreadyAssignedIds.has(u._id));
    const allSelected = unassignedVisible.every((u) => selectedUserIds.has(u._id));

    const next = new Set(selectedUserIds);
    if (allSelected) {
      unassignedVisible.forEach((u) => next.delete(u._id));
    } else {
      unassignedVisible.forEach((u) => next.add(u._id));
    }
    setSelectedUserIds(next);
  };

  const handleSubmit = async () => {
    if (selectedUserIds.size === 0) {
      toast.error("Please select at least one user to assign this coupon");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userIds: Array.from(selectedUserIds),
        mode: "add",
        sendNotification
      };

      const res = await assignCoupon(coupon._id, payload);
      if (res.success) {
        toast.success(
          res.message || `Coupon assigned to ${selectedUserIds.size} user(s) successfully!`
        );
        if (onAssigned) onAssigned(res.data);
        onClose();
      } else {
        toast.error(res.message || "Failed to assign coupon");
      }
    } catch (err) {
      console.error("Error assigning coupon:", err);
      toast.error(err.message || "Failed to assign coupon");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !coupon) return null;

  const discountBadge =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} FLAT OFF`;

  const unassignedVisibleCount = users.filter((u) => !alreadyAssignedIds.has(u._id)).length;
  const isAllSelected =
    unassignedVisibleCount > 0 &&
    users
      .filter((u) => !alreadyAssignedIds.has(u._id))
      .every((u) => selectedUserIds.has(u._id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50/50 to-white flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0D877F]/10 flex items-center justify-center text-[#0D877F]">
              <FiTag size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Assign Coupon</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D877F] text-white tracking-wide">
                  {coupon.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {discountBadge}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select active users to assign this coupon. Assigned users will be able to apply this code during booking.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* SEARCH AND SELECT ALL CONTROLS */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search active users by name, phone, email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={unassignedVisibleCount === 0 || loadingUsers}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                isAllSelected
                  ? "bg-[#0D877F] text-white border-[#0D877F]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FiUsers size={14} />
              {isAllSelected ? "Deselect All" : "Select All Available"}
            </button>

            <button
              type="button"
              onClick={() => fetchUsers(search)}
              title="Refresh users"
              className="p-2 bg-white text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              <FiRefreshCw size={14} className={loadingUsers ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* USER SELECTION LIST */}
        <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-gray-100 max-h-[380px]">
          {loadingUsers ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="w-7 h-7 border-2 border-[#0D877F] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading active users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <FiUser size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No active users found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search filter</p>
            </div>
          ) : (
            users.map((u) => {
              const isAlreadyAssigned = alreadyAssignedIds.has(u._id);
              const isSelected = selectedUserIds.has(u._id);

              return (
                <div
                  key={u._id}
                  onClick={() => {
                    if (!isAlreadyAssigned) handleToggleUser(u._id);
                  }}
                  className={`py-3 px-3 rounded-xl flex items-center justify-between transition gap-3 my-1 ${
                    isAlreadyAssigned
                      ? "bg-gray-50 opacity-60 cursor-not-allowed"
                      : isSelected
                      ? "bg-teal-50/70 border border-[#0D877F]/30 cursor-pointer shadow-xs"
                      : "hover:bg-gray-50/80 cursor-pointer border border-transparent"
                  }`}
                >
                  {/* Left: Checkbox + Avatar + Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected || isAlreadyAssigned}
                      disabled={isAlreadyAssigned}
                      onChange={() => {
                        if (!isAlreadyAssigned) handleToggleUser(u._id);
                      }}
                      className="w-4 h-4 text-[#0D877F] border-gray-300 rounded focus:ring-[#0D877F] cursor-pointer"
                    />

                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs">
                      {u.profileImage ? (
                        <img
                          src={u.profileImage}
                          alt={u.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        (u.name || "U")[0]
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {u.name || "Unnamed User"}
                        </p>
                        <span className="text-xs text-gray-400">·</span>
                        <p className="text-xs text-gray-600 font-mono">
                          {u.phoneNumber || "No Phone"}
                        </p>
                      </div>
                      {u.email && (
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Status / Already Assigned Badge */}
                  <div className="shrink-0">
                    {isAlreadyAssigned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <FiCheck size={12} /> Already Assigned
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D877F] text-white">
                        <FiCheck size={12} /> Selected
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">₹{u.walletBalance || 0} wallet</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <strong className="text-[#0D877F] font-bold text-sm">{selectedUserIds.size}</strong> user(s) selected
            </span>

            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 text-[#0D877F] rounded focus:ring-[#0D877F]"
              />
              <FiBell size={13} className="text-amber-500" />
              <span>Send push notification</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || selectedUserIds.size === 0}
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white transition flex items-center gap-2 cursor-pointer shadow-md ${
                submitting || selectedUserIds.size === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-[#0D877F] hover:bg-[#0b6f69] active:scale-98"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <FiUsers size={16} />
                  <span>Assign Coupon ({selectedUserIds.size})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
