import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { getAssociationDetails, updateAssociation, deleteAssociationDocument    } from "../../Services/association";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function UpdateAssociation() {
  const navigate = useNavigate();
  const { id } = useParams();

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
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  // ── Changed / added states for better document handling ──
  const [existingDocuments, setExistingDocuments] = useState([]);      // ["file1.jpg", "file2.pdf", ...] – original filenames
  const [newFiles, setNewFiles] = useState([]);                        // only newly selected File objects
  const [previews, setPreviews] = useState([]);                        // all preview URLs (old + new)

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch existing association data
  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const res = await getAssociationDetails(id);
        if (res.success && res.data) {
          const data = res.data;

          setFormData({
            associationName: data.associationName || "",
            governmentRegistrationNumber: data.governmentRegistrationNumber || "",
            yearOfFormation: data.yearOfFormation || "",
            fullAddress: data.fullAddress || "",
            city: data.city || "",
            state: data.state || "",
            pinCode: data.pinCode || "",
            presidentOrSecretary: data.presidentOrSecretary || "",
            countryCode: data.countryCode || "+91",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            registrationCertificateType: data.registrationCertificateType || "Company",
            verifiedBy: data.verifiedBy || "",
            verifiedAt: data.verifiedAt
              ? new Date(data.verifiedAt).toISOString().split("T")[0]
              : "",
            verificationStatus: data.verificationStatus || "Pending",
            isActive: data.isActive === true || data.isActive === "true" || !!data.isActive,
          });

          // ── Registration documents ──
          if (data.registrationDocument?.length > 0) {
            const docs = data.registrationDocument; // array of filenames
            setExistingDocuments(docs);
            setPreviews(docs.map((doc) => `${FILE_BASE_URL}/${doc}`));
          }

          // Profile image
          if (data.profileImage) {
            setProfilePreview(`${FILE_BASE_URL}/${data.profileImage}`);
          }
        } else {
          toast.error("Failed to load association data");
        }
      } catch (err) {
        toast.error("Error loading association");
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAssociation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isActive") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeProfileFile = () => {
    if (profilePreview && profileFile) URL.revokeObjectURL(profilePreview);
    setProfileFile(null);
    setProfilePreview(null);
  };

  const handleRegistrationFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeRegistrationFile = (index) => {
    // Revoke preview URL
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }

    // Case 1: removing a newly uploaded file
    if (index >= existingDocuments.length) {
      const newFileIdx = index - existingDocuments.length;
      setNewFiles((prev) => prev.filter((_, i) => i !== newFileIdx));
    }
    // Case 2: removing an existing document → we just remove from preview
    // (we'll detect deletion by comparing later in submit)

    // Always remove from previews
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    setFormData(initialFormData);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setNewFiles([]);
    setPreviews(existingDocuments.map((doc) => `${FILE_BASE_URL}/${doc}`));
    removeProfileFile();
    toast.success("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.associationName.trim() || !formData.email.trim()) {
      toast.error("Please fill required fields: Name, Email");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      // New profile image (replacement)
      if (profileFile) {
        payload.append("profileImage", profileFile);
      }

      // New registration documents
      newFiles.forEach((file) => {
        payload.append("registrationDocument", file);
      });

      // ── Calculate which original documents were REMOVED ──
      const deletedIndexes = [];

      existingDocuments.forEach((originalFilename, idx) => {
        const stillPresent = previews.some((previewUrl) =>
          previewUrl.endsWith(originalFilename)
        );
        if (!stillPresent) {
          deletedIndexes.push(idx);
        }
      });

      if (deletedIndexes.length > 0) {
        // Most common formats (choose one your backend expects):
        payload.append("documentIndexes", JSON.stringify(deletedIndexes));
        // OR: deletedIndexes.forEach((i) => payload.append("documentIndexes[]", i));
      }

      const result = await updateAssociation(id, payload);

      if (result.success) {
        toast.success("Association updated successfully!");
        navigate("/home/association/list");
      } else {
        toast.error(result.message || "Failed to update association");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gray-100 px-8 py-5 border-b flex items-center gap-4">
          <button
            onClick={() => navigate("/home/association/list")}
            className="text-gray-700 hover:bg-gray-200 p-2.5 rounded-full transition"
          >
            <FiArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Update Association</h1>
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
                    disabled
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
                    disabled
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
                  value={formData.isActive.toString()}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition text-sm"
                  required
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
                    <span className="text-sm text-gray-700 font-medium">Upload New Profile (optional)</span>
                    <span className="text-xs text-gray-500">PNG, JPG, max 5MB</span>
                  </label>
                </div>

                {profilePreview && (
                  <div className="flex justify-center pt-2">
                    <div className="relative group">
                      <img
                        src={profilePreview}
                        alt="Profile Preview"
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
                    <span className="text-sm text-gray-700 font-medium">Add New Documents (optional)</span>
                    <span className="text-xs text-gray-500">Multiple (img/pdf)</span>
                  </label>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2">
                    {previews.map((src, index) => (
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
            <button
              type="button"
              onClick={() => navigate("/home/association/list")}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <FiArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <FiRefreshCw size={16} />
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                "Update Association"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}