import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getReferAndEarnById,
  createReferAndEarn,
  updateReferAndEarn
} from "../../Services/referAndEarnService";
import { FiArrowLeft, FiGift, FiAward, FiUsers } from "react-icons/fi";

const ReferAndEarnForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "Refer and Earn",
    referrerBonus: "",
    referredUserBonus: "",
    description: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await getReferAndEarnById(id);
          if (res.success && res.data) {
            const data = res.data;
            setFormData({
              title: data.title || "Refer and Earn",
              referrerBonus: data.referrerBonus ?? "",
              referredUserBonus: data.referredUserBonus ?? "",
              description: data.description || "",
              status: data.status || "active",
            });
          } else {
            toast.error(res.message || "Failed to load details");
            navigate("/home/refer-and-earn");
          }
        } catch (err) {
          toast.error("Failed to fetch details");
          navigate("/home/refer-and-earn");
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Program title is required");
    }
    if (formData.referrerBonus === "" || Number(formData.referrerBonus) < 0) {
      return toast.error("Referrer bonus must be a non-negative number");
    }
    if (formData.referredUserBonus === "" || Number(formData.referredUserBonus) < 0) {
      return toast.error("Referred user bonus must be a non-negative number");
    }

    setSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      referrerBonus: Number(formData.referrerBonus),
      referredUserBonus: Number(formData.referredUserBonus),
      description: formData.description.trim(),
      status: formData.status,
    };

    try {
      const res = isEdit
        ? await updateReferAndEarn(id, payload)
        : await createReferAndEarn(payload);

      if (res.success) {
        toast.success(`Refer & Earn ${isEdit ? "updated" : "configured"} successfully`);
        navigate("/home/refer-and-earn");
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
        Loading details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Navigation link */}
        <div className="mb-6">
          <Link
            to="/home/refer-and-earn"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-3"
          >
            <FiArrowLeft size={16} /> Back to Refer & Earn
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Refer & Earn Settings" : "Configure Refer & Earn"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit
              ? "Update referral program bonus amounts and conditions"
              : "Set reward bonuses for users sharing referral codes with new signups"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Program Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Refer and Earn"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                required
              />
            </div>

            {/* Bonus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Referrer Bonus */}
              <div>
                <label htmlFor="referrerBonus" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <FiAward className="text-[#0D877F]" />
                  Referrer Bonus (₹ / Points)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                  <input
                    type="number"
                    id="referrerBonus"
                    name="referrerBonus"
                    value={formData.referrerBonus}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                    min="0"
                    step="any"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Amount given to the existing user who refers</p>
              </div>

              {/* Referred User Bonus */}
              <div>
                <label htmlFor="referredUserBonus" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <FiUsers className="text-blue-600" />
                  Referred User Bonus (₹ / Points)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                  <input
                    type="number"
                    id="referredUserBonus"
                    name="referredUserBonus"
                    value={formData.referredUserBonus}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                    min="0"
                    step="any"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Amount given to the new user signing up</p>
              </div>
            </div>

            {/* Description / Terms */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description & Terms
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain how users can refer friends and claim their rewards..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">This text can be displayed on the mobile app's Refer & Earn page</p>
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
                <option value="active">Active (Program is live)</option>
                <option value="inactive">Inactive (Program is paused)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">If inactive, referral codes cannot be used by new users</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link
                to="/home/refer-and-earn"
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#0D877F] text-white text-sm font-medium rounded-lg hover:bg-[#0b6f69] transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : isEdit ? "Update Settings" : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarnForm;
