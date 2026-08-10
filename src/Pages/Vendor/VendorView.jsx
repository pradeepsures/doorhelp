import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getVendorById, approveVendor, rejectVendor } from "../../Services/vendorService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function VendorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await getVendorById(id);
      setVendor(res.data);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveVendor(id);
      toast.success("Vendor approved successfully!");
      fetchVendor();
    } catch (err) {
      toast.error(err.message || "Failed to approve vendor");
    }
  };

  const handleReject = async () => {
    try {
      await rejectVendor(id);
      toast.success("Vendor rejected successfully!");
      fetchVendor();
    } catch (err) {
      toast.error(err.message || "Failed to reject vendor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-600">Loading vendor details...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-red-500">Vendor not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Back and Action Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <button
            onClick={() => navigate("/home/vendor")}
            className="flex items-center gap-2 text-[#0D877F] hover:underline font-semibold"
          >
            <FiArrowLeft size={18} /> Back to Vendors List
          </button>

          <div className="flex gap-2">
            {!vendor.isVerified ? (
              <button
                onClick={handleApprove}
                className="px-4 py-2 flex items-center gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-95 transition font-semibold text-sm shadow"
              >
                <FiCheckCircle /> Verify & Approve
              </button>
            ) : (
              <button
                onClick={handleReject}
                className="px-4 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm shadow"
              >
                <FiXCircle /> Reject / De-verify
              </button>
            )}
          </div>
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Side Profile Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col items-center p-6 text-center">
            <img
              src={vendor.profileImage ? `${BASE_URL}${vendor.profileImage}` : "https://via.placeholder.com/120x120?text=Vendor"}
              alt={vendor.name || "Vendor"}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#0D877F]/10 shadow-sm mb-4"
              onError={(e) => { e.target.src = "https://via.placeholder.com/120x120?text=Vendor" }}
            />
            <h2 className="text-xl font-bold text-gray-900">{vendor.name || "N/A"}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Partner Profile</p>

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {vendor.isVerified ? "Verified" : "Unverified"}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                Account: {vendor.status}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${vendor.onlineStatus === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                {vendor.onlineStatus}
              </span>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-3 text-left space-y-2 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Wallet Balance:</span>
                <span className="font-bold text-[#0D877F]">₹{vendor.walletBalance || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Profile Progress:</span>
                <span className="font-bold text-gray-700">{vendor.profileCompletion || 10}%</span>
              </div>
            </div>
          </div>

          {/* Details Content Card */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <span className="text-sm font-semibold text-gray-800">{vendor.phoneNumber}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                  <span className="text-sm font-semibold text-gray-800">{vendor.email || "N/A"}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                  <span className="text-sm font-semibold text-gray-800 capitalize">{vendor.gender || "N/A"}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</label>
                  <span className="text-sm font-semibold text-gray-800">{vendor.yearOfExperience !== undefined ? `${vendor.yearOfExperience} Years` : "N/A"}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City / Location</label>
                  <span className="text-sm font-semibold text-gray-800 capitalize">{vendor.city || "N/A"}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</label>
                  <span className="text-sm font-semibold text-gray-800">{vendor.address || "N/A"}</span>
                </div>
                {vendor.location?.lat && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">GPS Coordinates (Lat / Long)</label>
                    <span className="text-sm font-semibold text-gray-800">{vendor.location.lat} , {vendor.location.long}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Specializations & Tools */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Expertise & Equipment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {vendor.categories && vendor.categories.length > 0 ? (
                      vendor.categories.map((cat) => (
                        <span key={cat._id} className="px-3 py-1 bg-[#0D877F]/10 text-[#0D877F] font-semibold text-xs rounded-full">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No categories specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills & Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {vendor.skills && vendor.skills.length > 0 ? (
                      vendor.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools Available</label>
                  <div className="flex flex-wrap gap-2">
                    {vendor.tools && vendor.tools.length > 0 ? (
                      vendor.tools.map((tool, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 font-semibold text-xs rounded-full">
                          {tool}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No tools listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Verification Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Government ID */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex flex-col">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Government ID</span>
                  {vendor.governmentId && vendor.governmentId.length > 0 ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-1 gap-2">
                        {vendor.governmentId.map((doc, idx) => (
                          <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                              src={`${BASE_URL}${doc}`}
                              alt={`Government ID ${idx + 1}`}
                              className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/250x160?text=Document+File";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={`${BASE_URL}${doc}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white text-gray-800 rounded-md font-semibold text-xs shadow-md hover:bg-gray-100 transition"
                              >
                                View Large
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center text-xs text-gray-500 font-medium">
                        {vendor.governmentId.length} Document(s) uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">No Government ID uploaded</span>
                    </div>
                  )}
                </div>

                {/* Address Proof */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex flex-col">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Address Proof</span>
                  {vendor.addressProof && vendor.addressProof.length > 0 ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-1 gap-2">
                        {vendor.addressProof.map((doc, idx) => (
                          <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                              src={`${BASE_URL}${doc}`}
                              alt={`Address Proof ${idx + 1}`}
                              className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/250x160?text=Document+File";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={`${BASE_URL}${doc}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white text-gray-800 rounded-md font-semibold text-xs shadow-md hover:bg-gray-100 transition"
                              >
                                View Large
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center text-xs text-gray-500 font-medium">
                        {vendor.addressProof.length} Document(s) uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">No Address Proof uploaded</span>
                    </div>
                  )}
                </div>

                {/* Certificates */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex flex-col">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Certificates</span>
                  {vendor.professionalCertificate && vendor.professionalCertificate.length > 0 ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-1 gap-2">
                        {vendor.professionalCertificate.map((doc, idx) => (
                          <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                              src={`${BASE_URL}${doc}`}
                              alt={`Certificate ${idx + 1}`}
                              className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/250x160?text=Document+File";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={`${BASE_URL}${doc}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white text-gray-800 rounded-md font-semibold text-xs shadow-md hover:bg-gray-100 transition"
                              >
                                View Large
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center text-xs text-gray-500 font-medium">
                        {vendor.professionalCertificate.length} Document(s) uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">No Certificate uploaded</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
