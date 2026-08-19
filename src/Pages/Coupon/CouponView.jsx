import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { getCouponById, deleteCoupon } from "../../Services/couponService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const CouponView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Navigation / Actions Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/home/coupon"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <FiArrowLeft size={16} /> Back to List
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/home/coupon/edit/${coupon._id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition cursor-pointer"
            >
              <FiEdit size={16} /> Edit Coupon
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition cursor-pointer"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Coupon detail card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Top Banner / Summary */}
          <div className="bg-gradient-to-r from-[#0D877F] to-[#0b6f69] p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-wide uppercase">
                {coupon.code}
              </h2>
              <p className="text-sm opacity-90 mt-1 font-medium">{coupon.name}</p>
            </div>
            <div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-sm border ${
                  coupon.status === "active"
                    ? "bg-green-500/20 text-green-200 border-green-400"
                    : "bg-red-500/20 text-red-200 border-red-400"
                }`}
              >
                {coupon.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Details sections */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Financial & Discount Rules */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Discount Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-500 block">Discount Value</span>
                  <span className="text-lg font-bold text-gray-800">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% Off`
                      : `₹${coupon.discountValue} Flat Discount`}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Discount Type</span>
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {coupon.discountType}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Minimum Order Amount</span>
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{coupon.minOrderValue || 0}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Maximum Discount Cap</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {coupon.discountType === "percentage"
                      ? coupon.maxDiscountAmount > 0
                        ? `₹${coupon.maxDiscountAmount}`
                        : "Unlimited (No Cap)"
                      : "Not applicable (Flat rate)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Limits & Validity */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Validity & Limits
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-500 block">Start Date</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {coupon.startDate ? formatDate(coupon.startDate) : "Immediate"}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Expiry Date</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatDate(coupon.expiryDate)}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Usage Statistics</span>
                  <span className="text-sm font-semibold text-gray-700">
                    Used <strong className="text-[#0D877F]">{coupon.usageCount || 0}</strong> times out of{" "}
                    <strong className="text-gray-800">
                      {coupon.usageLimit ?? "Unlimited"}
                    </strong>
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Created On</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatDate(coupon.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponView;
