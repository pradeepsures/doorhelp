import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { getPlatformFeeById, deletePlatformFee } from "../../Services/platformFeeService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const PlatformFeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getPlatformFeeById(id);
        if (res.success && res.data) {
          setFeeData(res.data);
        } else {
          toast.error(res.message || "Failed to load platform fee details");
          navigate("/home/platform-fee");
        }
      } catch (err) {
        toast.error("Failed to fetch platform fee details");
        navigate("/home/platform-fee");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const res = await deletePlatformFee(id);
      if (res.success) {
        toast.success("Platform fee configuration deleted successfully");
        navigate("/home/platform-fee");
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

  if (!feeData) {
    return (
      <div className="p-6 text-center text-red-500 min-h-screen flex justify-center items-center">
        Platform fee configuration not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        {/* Navigation / Actions Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/home/platform-fee"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <FiArrowLeft size={16} /> Back to List
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/home/platform-fee/edit/${feeData._id}`)}
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

        {/* Detail Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#0D877F] to-[#0b6f69] p-6 text-white flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold bg-white/20 px-2.5 py-1 rounded">
                Configuration Details
              </span>
              <h2 className="text-2xl font-extrabold tracking-wide mt-2 uppercase">
                Platform Fee Settings
              </h2>
            </div>
            <div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-sm border ${
                  feeData.status === "active"
                    ? "bg-green-500/20 text-green-200 border-green-400"
                    : "bg-red-500/20 text-red-200 border-red-400"
                }`}
              >
                {feeData.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-6">
              <div>
                <span className="text-xs text-gray-500 block">Platform Fee Amount</span>
                <span className="text-xl font-bold text-gray-800">
                  ₹{feeData.platformFee.toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-500 block">GST Percentage</span>
                <span className="text-xl font-bold text-gray-800">
                  {feeData.gst}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-500 block">Created On</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatDate(feeData.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-500 block">Last Updated On</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatDate(feeData.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformFeeView;
