import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  getMembershipPlanById,
  updateMembershipPlan,
} from "../../Services/plan";

export default function PlanUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    expiryInDays: "",
    description: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ===============================
     FETCH PLAN DATA
  ================================ */
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getMembershipPlanById(id);
        const data = res.data;

        setFormData({
          type: data.type || "",
          amount: data.amount || "",
          expiryInDays: data.expiryInDays || "",
          description: data.description || "",
        });

        setOriginalData(data);
      } catch (err) {
        toast.error("Failed to fetch plan");
      } finally {
        setFetching(false);
      }
    };

    fetchPlan();
  }, [id]);

  /* ===============================
     HANDLE CHANGE
  ================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     CLEAR FORM
  ================================ */
  const handleClear = () => {
    setFormData({
      type: "",
      amount: "",
      expiryInDays: "",
      description: "",
    });
  };

  /* ===============================
     HANDLE UPDATE
     (Only send changed fields)
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedFields = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      toast("No changes made");
      return;
    }

    try {
      setLoading(true);
      await updateMembershipPlan(id, updatedFields);
      toast.success("Membership plan updated successfully");
      navigate("/home/plan/list");
    } catch (err) {
      toast.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Update Membership Plan
        </h1>

        {/* Back Button */}
        <button
          onClick={() => navigate("/home/plan/list")}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <FiArrowLeft /> Back to Plans
        </button>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type *
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Expiry Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry (Days) *
              </label>
              <input
                type="number"
                name="expiryInDays"
                value={formData.expiryInDays}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4">

              {/* Clear Button */}
              <button
                type="button"
                onClick={handleClear}
                className="text-sm px-4 py-2 rounded-md text-white bg-gray-800 hover:bg-blue-600 transition"
              >
                Clear
              </button>

              {/* Update Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Plan"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
