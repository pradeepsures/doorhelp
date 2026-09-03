import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiTrash2, FiAward, FiUsers, FiInfo } from "react-icons/fi";
import { getReferAndEarnById, deleteReferAndEarn } from "../../Services/referAndEarnService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const ReferAndEarnView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getReferAndEarnById(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          toast.error(res.message || "Failed to load Refer & Earn details");
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
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const res = await deleteReferAndEarn(id);
      if (res.success) {
        toast.success("Refer & Earn configuration deleted successfully");
        navigate("/home/refer-and-earn");
      } else {
        toast.error(res.message || "Failed to delete configuration");
      }
    } catch (err) {
      toast.error("Failed to delete configuration");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
        Loading details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-500 min-h-screen flex justify-center items-center">
        Refer & Earn configuration not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/home/refer-and-earn"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <FiArrowLeft size={16} /> Back to List
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/home/refer-and-earn/edit/${data._id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition cursor-pointer"
            >
              <FiEdit size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition cursor-pointer"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#0D877F] to-[#0b6f69] p-6 text-white flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold bg-white/20 px-2.5 py-1 rounded">
                Referral Program Settings
              </span>
              <h2 className="text-2xl font-extrabold tracking-wide mt-2">
                {data.title || "Refer and Earn"}
              </h2>
            </div>
            <div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-sm border ${
                  data.status === "active"
                    ? "bg-green-500/20 text-green-200 border-green-400"
                    : "bg-red-500/20 text-red-200 border-red-400"
                }`}
              >
                {data.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-6">
              <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <FiAward /> Referrer Bonus
                </span>
                <span className="text-2xl font-black text-[#0D877F]">
                  ₹{data.referrerBonus}
                </span>
                <p className="text-xs text-gray-500 mt-1">Given to the inviter</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <FiUsers /> Referred User Bonus
                </span>
                <span className="text-2xl font-black text-blue-600">
                  ₹{data.referredUserBonus}
                </span>
                <p className="text-xs text-gray-500 mt-1">Given to the new member</p>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-500 uppercase font-semibold block mb-2 flex items-center gap-1.5">
                <FiInfo /> Description / Rules
              </span>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {data.description || "No description provided."}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Created On</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatDate(data.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-medium">Last Updated On</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatDate(data.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarnView;
