import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getPlatformFeeById, createPlatformFee, updatePlatformFee } from "../../Services/platformFeeService";

const PlatformFeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    platformFee: "",
    gst: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await getPlatformFeeById(id);
          if (res.success && res.data) {
            const data = res.data;
            setFormData({
              platformFee: data.platformFee ?? "",
              gst: data.gst ?? "",
              status: data.status || "active",
            });
          } else {
            toast.error(res.message || "Failed to load details");
            navigate("/home/platform-fee");
          }
        } catch (err) {
          toast.error("Failed to fetch details");
          navigate("/home/platform-fee");
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

    if (formData.platformFee === "" || Number(formData.platformFee) < 0) {
      return toast.error("Platform fee must be 0 or greater");
    }
    if (formData.gst === "" || Number(formData.gst) < 0) {
      return toast.error("GST percentage must be 0 or greater");
    }

    setSubmitting(true);
    const payload = {
      platformFee: Number(formData.platformFee),
      gst: Number(formData.gst),
      status: formData.status,
    };

    try {
      const res = isEdit
        ? await updatePlatformFee(id, payload)
        : await createPlatformFee(payload);

      if (res.success) {
        toast.success(`Platform Fee ${isEdit ? "updated" : "created"} successfully`);
        navigate("/home/platform-fee");
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
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Platform Fee Settings" : "Create Platform Fee Settings"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Modify platform fee amount and GST configuration" : "Set global platform fee amount and GST percentages"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Platform Fee */}
              <div>
                <label htmlFor="platformFee" className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform Fee Amount (₹)
                </label>
                <input
                  type="number"
                  id="platformFee"
                  name="platformFee"
                  value={formData.platformFee}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="0"
                  step="any"
                  required
                />
              </div>

              {/* GST percentage */}
              <div>
                <label htmlFor="gst" className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Percentage (%)
                </label>
                <input
                  type="number"
                  id="gst"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="e.g. 18"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                  min="0"
                  step="any"
                  required
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
                to="/home/platform-fee"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0D877F] text-white text-sm font-medium rounded-lg hover:bg-[#0b6f69] transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlatformFeeForm;
