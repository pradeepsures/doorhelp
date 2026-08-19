import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getCouponById, createCoupon, updateCoupon } from "../../Services/couponService";

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "flat",
    discountValue: "",
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: "",
    expiryDate: "",
    usageLimit: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper to convert date to YYYY-MM-DD for HTML input
  const toInputDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (isEdit) {
      const fetchCouponDetails = async () => {
        setLoading(true);
        try {
          const res = await getCouponById(id);
          if (res.success && res.data) {
            const coupon = res.data;
            setFormData({
              name: coupon.name || "",
              code: coupon.code || "",
              discountType: coupon.discountType || "percentage",
              discountValue: coupon.discountValue || "",
              minOrderValue: coupon.minOrderValue || 0,
              maxDiscountAmount: coupon.maxDiscountAmount || 0,
              startDate: toInputDate(coupon.startDate),
              expiryDate: toInputDate(coupon.expiryDate),
              usageLimit: coupon.usageLimit ?? "",
              status: coupon.status || "active",
            });
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

      fetchCouponDetails();
    } else {
      // Default start date to today
      setFormData((prev) => ({
        ...prev,
        startDate: toInputDate(new Date()),
      }));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      return toast.error("Coupon title is required");
    }
    if (!formData.code.trim()) {
      return toast.error("Coupon code is required");
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      return toast.error("Discount value must be greater than zero");
    }
    if (!formData.expiryDate) {
      return toast.error("Expiry date is required");
    }
    if (formData.startDate && formData.expiryDate < formData.startDate) {
      return toast.error("Expiry date cannot be before start date");
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscountAmount: Number(formData.maxDiscountAmount),
      usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
    };

    try {
      const res = isEdit
        ? await updateCoupon(id, payload)
        : await createCoupon(payload);

      if (res.success) {
        toast.success(`Coupon ${isEdit ? "updated" : "created"} successfully`);
        navigate("/home/coupon");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
        Loading coupon details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Coupon" : "Add Coupon"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Modify existing coupon settings and rules" : "Create a new discount coupon code"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Title */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Coupon Title
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Welcome Discount"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  required
                />
              </div>

              {/* Coupon Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. WELCOME50"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 font-semibold tracking-wider uppercase"
                  required
                />
              </div>

              {/* Discount Type */}
              <div>
                <label htmlFor="discountType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label htmlFor="discountValue" className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Value {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={formData.discountType === "percentage" ? "e.g. 10" : "e.g. 150"}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="0.01"
                  step="any"
                  required
                />
              </div>

              {/* Min Order Value */}
              <div>
                <label htmlFor="minOrderValue" className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  id="minOrderValue"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleChange}
                  placeholder="e.g. 499"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="0"
                />
              </div>

              {/* Max Discount Amount */}
              <div>
                <label htmlFor="maxDiscountAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Maximum Discount Amount (₹)
                </label>
                <input
                  type="number"
                  id="maxDiscountAmount"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  placeholder="e.g. 200 (set 0 for flat discount / no limit)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="0"
                  disabled={formData.discountType === "flat"}
                />
                {formData.discountType === "flat" && (
                  <span className="text-xs text-gray-400 mt-1 block">Not applicable for flat discount</span>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  required
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label htmlFor="usageLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                  Usage Limit (Max Uses)
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="e.g. 100 (leave blank for unlimited)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="1"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link
                to="/home/coupon"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0D877F] text-white text-sm font-medium rounded-lg hover:bg-[#0b6f69] transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Coupon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
