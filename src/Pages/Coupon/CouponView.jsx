import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiUserMinus,
  FiPlus,
  FiSearch,
  FiCheck,
  FiUser
} from "react-icons/fi";
import { getCouponById, deleteCoupon, unassignCoupon } from "../../Services/couponService";
import { formatDate } from "../../utils/dateFormatter";
import AssignCouponModal from "./AssignCouponModal";
import toast from "react-hot-toast";

const CouponView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [unassigningId, setUnassigningId] = useState(null);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const res = await getCouponById(id);
      if (res.success && res.data) {
        setCoupon(res.data);
      } else {
        toast.error(res.message || "Failed to load coupon details");
        navigate("/home/coupon");
      }
    } catch (err) {
      toast.error("Failed to fetch coupon details");
      navigate("/home/coupon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await deleteCoupon(id);
      if (res.success) {
        toast.success("Coupon deleted successfully");
        navigate("/home/coupon");
      } else {
        toast.error(res.message || "Failed to delete coupon");
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleUnassignUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to unassign coupon from "${userName || "this user"}"?`)) {
      return;
    }

    try {
      setUnassigningId(userId);
      const res = await unassignCoupon(id, { userIds: [userId] });
      if (res.success) {
        toast.success("User unassigned from coupon successfully");
        fetchCoupon();
      } else {
        toast.error(res.message || "Failed to unassign user");
      }
    } catch (err) {
      console.error("Error unassigning user:", err);
      toast.error("Failed to unassign user");
    } finally {
      setUnassigningId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#0D877F] border-t-transparent rounded-full animate-spin mr-3" />
        Loading coupon details...
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="p-6 text-center text-red-500 min-h-screen flex justify-center items-center">
        Coupon not found
      </div>
    );
  }

  const assignedUsers = Array.isArray(coupon.assignedUsers) ? coupon.assignedUsers : [];
  const filteredUsers = assignedUsers.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    const nameMatch = (u.name || "").toLowerCase().includes(q);
    const phoneMatch = (u.phoneNumber || "").toLowerCase().includes(q);
    const emailMatch = (u.email || "").toLowerCase().includes(q);
    return nameMatch || phoneMatch || emailMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-6 w-full">
      <div className="w-full space-y-6">
        {/* Navigation / Actions Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to="/home/coupon"
            className="flex items-center gap-2 text-gray-600 hover:text-[#0D877F] transition-colors text-sm font-semibold cursor-pointer"
          >
            <FiArrowLeft size={16} /> Back to Coupons
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            {/* <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2 bg-[#0D877F] hover:bg-[#0b6f69] text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition cursor-pointer shadow-sm active:scale-98"
            >
              <FiUsers size={16} /> Assign to Users
            </button> */}

            <button
              onClick={() => navigate(`/home/coupon/edit/${coupon._id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition cursor-pointer shadow-sm"
            >
              <FiEdit size={16} /> Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition cursor-pointer shadow-sm"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* TOP SUMMARY BANNER CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
          <div className="bg-gradient-to-r from-[#0D877F] to-[#0b6f69] p-6 text-white flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-extrabold tracking-wider uppercase font-mono">
                  {coupon.code}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} FLAT OFF`}
                </span>
              </div>
              <p className="text-sm opacity-90 mt-1 font-medium">{coupon.name}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase shadow-xs border ${
                  coupon.status === "active"
                    ? "bg-green-500/20 text-green-100 border-green-400"
                    : "bg-red-500/20 text-red-100 border-red-400"
                }`}
              >
                {coupon.status === "active" ? "Active" : "Inactive"}
              </span>

              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase shadow-xs border ${
                  coupon.isForAllUsers
                    ? "bg-blue-500/20 text-blue-100 border-blue-400"
                    : "bg-amber-500/20 text-amber-100 border-amber-400"
                }`}
              >
                {coupon.isForAllUsers ? "Universal (All Users)" : "Targeted Users"}
              </span>
            </div>
          </div>

          {/* Details sections */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Left Column: Financial & Discount Rules */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Discount Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Discount Value</span>
                  <span className="text-lg font-extrabold text-gray-800 mt-1 block">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% Off`
                      : `₹${coupon.discountValue} Flat`}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Discount Type</span>
                  <span className="text-sm font-semibold text-gray-700 capitalize mt-1.5 block">
                    {coupon.discountType}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Audience Scope</span>
                  <span className="text-xs font-semibold text-gray-700 mt-1.5 block leading-tight">
                    {coupon.isForAllUsers ? "Universal (All Users)" : "Specific Assigned Users"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Limits & Validity */}
            <div className="space-y-4 pt-6 lg:pt-0 lg:pl-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Validity & Limits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Start Date</span>
                  <span className="text-xs font-semibold text-gray-700 mt-1.5 block">
                    {coupon.startDate ? formatDate(coupon.startDate) : "Immediate"}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Expiry Date</span>
                  <span className="text-xs font-semibold text-red-600 mt-1.5 block">
                    {formatDate(coupon.expiryDate)}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Usage Statistics</span>
                  <span className="text-xs font-semibold text-gray-700 mt-1.5 block">
                    <strong className="text-[#0D877F] font-bold">{coupon.usageCount || 0}</strong> /{" "}
                    <strong className="text-gray-800">{coupon.usageLimit ?? "∞"}</strong>
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block font-medium">Created On</span>
                  <span className="text-xs font-semibold text-gray-700 mt-1.5 block">
                    {formatDate(coupon.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGNED USERS DETAIL CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D877F] flex items-center justify-center font-bold">
                <FiUsers size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Assigned Users</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0D877F] text-white">
                    {assignedUsers.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {coupon.isForAllUsers
                    ? "This coupon is universal (available to all users). You can also assign it to specific users."
                    : "Only these assigned users are eligible to apply this coupon code."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-3.5 py-2 bg-[#0D877F] hover:bg-[#0b6f69] text-white rounded-xl flex items-center gap-2 text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <FiPlus size={14} /> Assign More Users
              </button>
            </div>
          </div>

          {/* User Search filter inside assigned users */}
          {assignedUsers.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-100 bg-white">
              <div className="relative max-w-sm">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Filter assigned users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#0D877F] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Assigned Users List / Table */}
          {assignedUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FiUsers size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No users specifically assigned yet</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Currently, this coupon can be claimed by all active users. Click "Assign to Users" to restrict or grant it to specific individual users.
              </p>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0D877F] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer hover:bg-[#0b6f69] transition"
              >
                <FiPlus size={14} /> Assign Users Now
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No assigned users match your search "{userSearch}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-3 font-semibold">User</th>
                    <th className="px-6 py-3 font-semibold">Phone Number</th>
                    <th className="px-6 py-3 font-semibold">Wallet Balance</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const isUnassigning = unassigningId === user._id;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/70 transition-colors">
                        {/* User info */}
                        <td className="px-6 py-3.5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              (user.name || "U")[0]
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name || "Unnamed User"}</p>
                            {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-3.5 text-gray-700 font-mono text-xs">
                          {user.phoneNumber || "—"}
                        </td>

                        {/* Wallet Balance */}
                        <td className="px-6 py-3.5 font-semibold text-gray-800">
                          ₹{user.walletBalance || 0}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.status !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status !== false ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleUnassignUser(user._id, user.name)}
                            disabled={isUnassigning}
                            className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition inline-flex items-center gap-1 cursor-pointer border border-red-200"
                            title="Remove this user from coupon"
                          >
                            <FiUserMinus size={13} />
                            {isUnassigning ? "Removing..." : "Unassign"}
                          </button>
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

      {/* ASSIGN COUPON MODAL */}
      <AssignCouponModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        coupon={coupon}
        onAssigned={() => fetchCoupon()}
      />
    </div>
  );
};

export default CouponView;
