import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createAppVersion, updateAppVersion } from "../../Services/appVersionService";

const AppVersionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    userAppVersion: "",
    vendorAppVersion: "",
    isUpdateMandatory: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && location.state?.versionData) {
      setFormData({
        userAppVersion: location.state.versionData.userAppVersion || "",
        vendorAppVersion: location.state.versionData.vendorAppVersion || "",
        isUpdateMandatory: location.state.versionData.isUpdateMandatory || false,
      });
    }
  }, [isEditMode, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await updateAppVersion(id, formData);
      } else {
        res = await createAppVersion(formData);
      }
      if (res.success) {
        toast.success(isEditMode ? "App version updated successfully!" : "App version created successfully!");
        navigate("/home/app-version");
      } else {
        toast.error(res.message || "Failed to save app version");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save app version");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D877F]">
          {isEditMode ? "Update App Version" : "Create App Version"}
        </h1>
        <button
          onClick={() => navigate("/home/app-version")}
          className="text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 px-4 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">User App Version <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="userAppVersion"
              value={formData.userAppVersion}
              onChange={handleChange}
              placeholder="e.g. 1.0.5"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D877F] focus:ring-2 focus:ring-[#0D877F]/20 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Vendor App Version <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="vendorAppVersion"
              value={formData.vendorAppVersion}
              onChange={handleChange}
              placeholder="e.g. 1.0.3"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D877F] focus:ring-2 focus:ring-[#0D877F]/20 transition-all outline-none"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isUpdateMandatory"
              name="isUpdateMandatory"
              checked={formData.isUpdateMandatory}
              onChange={handleChange}
              className="w-5 h-5 text-[#0D877F] border-gray-300 rounded focus:ring-[#0D877F]"
            />
            <label htmlFor="isUpdateMandatory" className="text-sm font-medium text-gray-700 cursor-pointer">
              Is Update Mandatory?
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D877F] text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEditMode ? "Update Version" : "Create Version"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppVersionForm;
