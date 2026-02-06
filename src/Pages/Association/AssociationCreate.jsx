import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX, FiRefreshCw } from "react-icons/fi"; // added FiRefreshCw for clear
import { toast } from "react-hot-toast";

export default function CreateAssociation() {
  const navigate = useNavigate();

  const initialFormData = {
    associationName: "",
    governmentRegistrationNumber: "",
    yearOfFormation: "",
    fullAddress: "",
    city: "",
    state: "",
    pinCode: "",
    presidentOrSecretary: "",
    countryCode: "+91",
    phoneNumber: "",
    email: "",
    registrationCertificateType: "Company",
    verifiedBy: "",
    verifiedAt: "",
    verificationStatus: "Pending",
    isActive: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [registrationFiles, setRegistrationFiles] = useState([]);
  const [registrationPreviews, setRegistrationPreviews] = useState([]);

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeProfileFile = () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(null);
    setProfilePreview(null);
  };

  const handleRegistrationFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setRegistrationFiles((prev) => [...prev, ...files]);
    setRegistrationPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeRegistrationFile = (index) => {
    URL.revokeObjectURL(registrationPreviews[index]);
    setRegistrationFiles((prev) => prev.filter((_, i) => i !== index));
    setRegistrationPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    setFormData(initialFormData);
    setRegistrationFiles([]);
    setRegistrationPreviews([]);
    setProfileFile(null);
    setProfilePreview(null);
    // Optional: show toast
    toast.success("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.associationName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      toast.error("Please fill required fields: Name, Email, Phone");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      registrationFiles.forEach((file) => {
        payload.append("registrationDocument", file);
      });

      if (profileFile) {
        payload.append("profileImage", profileFile);
      }

      const res = await fetch("http://159.89.146.245:7007/api/admin/create-association", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: payload,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Association created successfully!");
        navigate("/home/association/list");
      } else {
        toast.error(result.message || "Failed to create association");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gray-100 px-8 py-5 border-b flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:bg-gray-200 p-2.5 rounded-full transition"
          >
            <FiArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create New Association</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Association Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="associationName"
                  value={formData.associationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Government Registration Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="governmentRegistrationNumber"
                  value={formData.governmentRegistrationNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Formation</label>
                <input
                  type="number"
                  name="yearOfFormation"
                  value={formData.yearOfFormation}
                  onChange={handleChange}
                  placeholder="YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate Type</label>
                <select
                  name="registrationCertificateType"
                  value={formData.registrationCertificateType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition text-sm"
                >
                  <option value="Company">Company</option>
                  <option value="Firm">Firm</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
                <input
                  type="text"
                  name="verifiedBy"
                  value={formData.verifiedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified At</label>
                <input
                  type="date"
                  name="verifiedAt"
                  value={formData.verifiedAt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">President / Secretary</label>
                <input
                  type="text"
                  name="presidentOrSecretary"
                  value={formData.presidentOrSecretary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                  <input
                    type="text"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  required
                />
              </div>

              {/* City, State, Pin Code right after Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <select
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-600">*</span>
                </label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition text-sm"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full Address */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition text-sm min-h-[88px]"
            />
          </div>

          {/* Upload Files */}
          <div className="mt-7">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Upload Files</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {/* Profile Image */}
              <div className="space-y-2.5">
                <label className="block text-base font-medium text-gray-800">Profile Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileFile}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <FiUpload size={26} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">Upload Profile</span>
                    <span className="text-xs text-gray-500">PNG, JPG, max 5MB</span>
                  </label>
                </div>

                {profilePreview && (
                  <div className="flex justify-center pt-2">
                    <div className="relative group">
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="h-28 w-28 object-cover rounded-full border-2 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeProfileFile}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Documents */}
              <div className="space-y-2.5">
                <label className="block text-base font-medium text-gray-800">Registration Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleRegistrationFiles}
                    className="hidden"
                    id="registration-upload"
                  />
                  <label htmlFor="registration-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <FiUpload size={26} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">Upload Documents</span>
                    <span className="text-xs text-gray-500">Multiple (img/pdf)</span>
                  </label>
                </div>

                {registrationPreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2">
                    {registrationPreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt={`preview ${index + 1}`}
                          className="h-18 w-full object-cover rounded border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeRegistrationFile(index)}
                          className="absolute -top-0.5 -right-0.5 bg-red-600 text-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/home/association/list")}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <FiArrowLeft size={16} />
              Back
            </button>

            {/* Clear Form Button */}
            <button
              type="button"
              onClick={handleClearForm}
              className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <FiRefreshCw size={16} />
              Clear Form
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                "Create Association"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}