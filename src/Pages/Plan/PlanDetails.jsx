import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getMembershipPlanById } from "../../Services/plan";

export default function PlanView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================
     FETCH PLAN BY ID
  ========================================= */
  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await getMembershipPlanById(id);
      setPlan(res.data);
    } catch (err) {
      toast.error("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Plan Details
        </h1>

        {/* Back Button */}
        <button
          onClick={() => navigate("/home/plan/list")}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <FiArrowLeft /> Back to Plans
        </button>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : !plan ? (
            <div className="text-center text-gray-500 py-10">
              Plan not found
            </div>
          ) : (
            <div className="divide-y divide-gray-300/50">

              {/* Row */}
              <div className="grid grid-cols-2 px-6 py-4 border-b bg-gray-300/5 border-opacity-50">
                <div className="font-medium text-gray-900">Plan Type</div>
                <div className="text-gray-600 font-semibold">
                  {plan.type}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-2 px-6 py-4 border-b bg-gray-300/5 border-opacity-50">
                <div className="font-medium text-gray-900">Amount</div>
                <div className="text-gray-600 font-semibold">
                  ₹ {plan.amount}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-2 px-6 py-4 border-b bg-gray-300/5 border-opacity-50">
                <div className="font-medium text-gray-900">
                  Expiry (Days)
                </div>
                <div className="text-gray-600 font-semibold">
                  {plan.expiryInDays} Days
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-2 px-6 py-4 border-b bg-gray-300/5 border-opacity-50">
                <div className="font-medium text-gray-900">
                  Created At
                </div>
                <div className="text-gray-600 font-semibold">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-2 px-6 py-4 bg-gray-300/5">
                <div className="font-medium text-gray-900">
                  Description
                </div>
                <div className="text-gray-600 font-semibold">
                  {plan.description}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
