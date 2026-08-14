import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Compass, 
  Briefcase, 
  Wallet, 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  X,
  Maximize2,
  Download
} from "lucide-react";
import { getVendorById, approveVendor, rejectVendor } from "../../Services/vendorService";
import { formatDate } from "../../utils/dateFormatter";
import { formatStatus } from "../../utils/stringFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function VendorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
      setActionLoading(true);
      await approveVendor(id);
      toast.success("Vendor approved successfully!");
      fetchVendor();
    } catch (err) {
      toast.error(err.message || "Failed to approve vendor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectVendor(id);
      toast.success("Vendor rejected successfully!");
      fetchVendor();
    } catch (err) {
      toast.error(err.message || "Failed to reject vendor");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper function to force download an image file
  const downloadImage = async (imageUrl, defaultName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = defaultName || 'downloaded-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started!");
    } catch (error) {
      console.error("Failed download via blob fetch, opening in new tab:", error);
      // Fallback
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = defaultName || 'downloaded-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Opening image in new tab to save");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0D877F] animate-spin"></div>
        </div>
        <p className="text-xs font-semibold text-slate-500">Retrieving partner credentials...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-6 text-center">
        <XCircle size={44} className="text-rose-500 mb-3" />
        <h2 className="text-base font-bold text-slate-800">Partner Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The requested vendor partner could not be loaded. They might have been removed.
        </p>
        <button 
          onClick={() => navigate("/home/vendor")}
          className="mt-4 px-4 py-2 bg-[#0D877F] text-white rounded-xl text-xs font-semibold hover:bg-opacity-95 transition"
        >
          Back to Partners List
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-3 md:p-5 text-slate-700 space-y-4">
      
      {/* Breadcrumbs & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Master</span>
            <ChevronRight size={10} />
            <Link to="/home/vendor" className="hover:text-[#0D877F] transition-colors">Partners</Link>
            <ChevronRight size={10} />
            <span className="text-slate-600">Profile details</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/home/vendor")}
              className="p-1.5 bg-slate-50 rounded-lg text-slate-500 hover:text-[#0D877F] hover:bg-slate-100 border border-slate-200/50 transition-all focus:outline-none"
              title="Go Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {vendor.name || "Partner Profile"}
            </h1>
          </div>
        </div>

        {/* Verification trigger buttons */}
        <div className="flex items-center gap-2">
          {actionLoading ? (
            <button disabled className="px-3.5 py-2 bg-slate-150 text-slate-400 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-not-allowed">
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </button>
          ) : !vendor.isVerified ? (
            <button
              onClick={handleApprove}
              className="px-3.5 py-2 bg-[#0D877F] hover:bg-[#0A6B65] text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Verify & Approve</span>
            </button>
          ) : (
            <button
              onClick={handleReject}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <XCircle size={14} />
              <span>Reject / De-verify</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Stacked Cards */}
      <div className="space-y-4">
        
        {/* CARD 1: PROFILE SUMMARY & BUSINESS INFO */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Profile Section */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center gap-4 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-5 shrink-0">
              
              <div className="relative shrink-0 group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 w-24 h-24 md:w-28 md:h-28">
                <img
                  src={vendor.profileImage ? `${BASE_URL}${vendor.profileImage}` : "https://via.placeholder.com/120x120?text=Vendor"}
                  alt={vendor.name || "Vendor"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/120x120?text=Vendor" }}
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                  <button 
                    onClick={() => setModalImage(vendor.profileImage ? `${BASE_URL}${vendor.profileImage}` : "https://via.placeholder.com/400x400?text=Vendor")}
                    className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded text-white transition-all focus:outline-none"
                  >
                    <Maximize2 size={12} />
                  </button>
                  <button 
                    onClick={() => downloadImage(vendor.profileImage ? `${BASE_URL}${vendor.profileImage}` : "https://via.placeholder.com/400x400?text=Vendor", `${vendor.name || 'vendor'}-profile.jpg`)}
                    className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded text-white transition-all focus:outline-none"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-2 w-full text-left">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{vendor.name || "N/A"}</h2>
                  <span className="text-xs font-bold text-[#0D877F] uppercase tracking-wider block mt-1">Partner Summary</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold border ${
                    vendor.isVerified 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {vendor.isVerified ? <ShieldCheck size={11} className="shrink-0" /> : <ShieldAlert size={11} className="shrink-0" />}
                    {vendor.isVerified ? "Verified" : "Unverified"}
                  </span>

                  {vendor.status && (
                    <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded text-xs font-bold capitalize border ${
                      vendor.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      Account: {formatStatus(vendor.status)}
                    </span>
                  )}

                  {vendor.onlineStatus && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold capitalize border ${
                      vendor.onlineStatus === 'online' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {vendor.onlineStatus === 'online' && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                        </span>
                      )}
                      {formatStatus(vendor.onlineStatus)}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 w-full text-left">
                  <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-gray-500 uppercase">Wallet Balance:</span>
                    <span className="text-base font-extrabold text-[#0D877F]">₹{vendor.walletBalance || 0}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500 uppercase">Profile Progress:</span>
                      <span className="text-slate-700">{vendor.profileCompletion || 10}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0D877F] to-emerald-400 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${vendor.profileCompletion || 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Business Details (Right Column) */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Briefcase size={14} className="text-[#0D877F]" /> Business Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vendor.phoneNumber && (
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Phone Number</div>
                    <div className="text-sm font-semibold text-gray-800">{vendor.phoneNumber}</div>
                  </div>
                )}

                {vendor.email && (
                  <div className="overflow-hidden">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Email Address</div>
                    <div className="text-sm font-semibold text-gray-800 truncate" title={vendor.email}>{vendor.email}</div>
                  </div>
                )}

                {vendor.gender && (
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Gender</div>
                    <div className="text-sm font-semibold text-gray-800 capitalize">{formatStatus(vendor.gender)}</div>
                  </div>
                )}

                {vendor.yearOfExperience !== undefined && vendor.yearOfExperience !== null && (
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Experience</div>
                    <div className="text-sm font-semibold text-gray-800">{vendor.yearOfExperience} Years</div>
                  </div>
                )}

                {vendor.city && (
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">City / Location</div>
                    <div className="text-sm font-semibold text-gray-800 capitalize">{vendor.city}</div>
                  </div>
                )}


                {vendor.address && (
                  <div className="sm:col-span-2 md:col-span-3">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Full Address</div>
                    <div className="text-sm font-semibold text-gray-800 leading-snug">{vendor.address}</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* CARD 2: EXPERTISE & COVERAGE */}
        {((vendor.categories && vendor.categories.length > 0) || 
          (vendor.skills && vendor.skills.length > 0) || 
          (vendor.tools && vendor.tools.length > 0) ||
          (vendor.localities && vendor.localities.length > 0)) && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Award size={14} className="text-[#0D877F]" /> Expertise & Service Coverage Area
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendor.categories && vendor.categories.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-2">Service Categories</div>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.categories.map((cat) => (
                      <span key={cat._id} className="px-2.5 py-1 bg-[#0D877F]/10 text-[#0D877F] font-bold text-xs rounded border border-[#0D877F]/10">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {vendor.skills && vendor.skills.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-2">Skills & Specialities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.skills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-100/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {vendor.tools && vendor.tools.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-2">Tools Registered</div>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.tools.map((tool, index) => (
                      <span key={index} className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded border border-purple-100/50">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {vendor.localities && vendor.localities.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-2">Coverage Localities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.localities.map((loc) => (
                      <span key={loc._id || loc} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-100">
                        {loc.name || (typeof loc === 'string' ? loc : 'Locality')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CARD 3: VERIFICATION DOCUMENTS & KYC */}
        {(vendor.adharNumber || vendor.adharFront || vendor.adharBack || 
          vendor.panNumber || vendor.panFront || vendor.panBack || 
          (vendor.professionalCertificate && vendor.professionalCertificate.length > 0)) && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <FileText size={14} className="text-[#0D877F]" /> KYC Credentials & Identity Proofs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Aadhaar card section */}
              {(vendor.adharNumber || vendor.adharFront || vendor.adharBack) && (
                <div className="flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Aadhaar Card Details</div>
                    {vendor.adharNumber && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase block">Aadhaar No.</span>
                        <span className="text-sm font-bold text-gray-800 font-mono tracking-wider">{vendor.adharNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {vendor.adharFront && (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <span className="block text-[8px] font-bold text-slate-400 text-center py-0.5 bg-slate-100 border-b border-slate-200">FRONT</span>
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={`${BASE_URL}${vendor.adharFront}`}
                            alt="Aadhaar Front"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/250x160?text=Aadhaar+Front"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                            <button onClick={() => setModalImage(`${BASE_URL}${vendor.adharFront}`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Maximize2 size={12} /></button>
                            <button onClick={() => downloadImage(`${BASE_URL}${vendor.adharFront}`, `${vendor.name || 'vendor'}-aadhaar-front.jpg`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Download size={12} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                    {vendor.adharBack && (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <span className="block text-[8px] font-bold text-slate-400 text-center py-0.5 bg-slate-100 border-b border-slate-200">BACK</span>
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={`${BASE_URL}${vendor.adharBack}`}
                            alt="Aadhaar Back"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/250x160?text=Aadhaar+Back"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                            <button onClick={() => setModalImage(`${BASE_URL}${vendor.adharBack}`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Maximize2 size={12} /></button>
                            <button onClick={() => downloadImage(`${BASE_URL}${vendor.adharBack}`, `${vendor.name || 'vendor'}-aadhaar-back.jpg`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Download size={12} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAN card section */}
              {(vendor.panNumber || vendor.panFront || vendor.panBack) && (
                <div className="flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">PAN Card Details</div>
                    {vendor.panNumber && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase block">PAN No.</span>
                        <span className="text-sm font-bold text-gray-800 font-mono tracking-wider">{vendor.panNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {vendor.panFront && (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <span className="block text-[8px] font-bold text-slate-400 text-center py-0.5 bg-slate-100 border-b border-slate-200">FRONT</span>
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={`${BASE_URL}${vendor.panFront}`}
                            alt="PAN Front"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/250x160?text=PAN+Front"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                            <button onClick={() => setModalImage(`${BASE_URL}${vendor.panFront}`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Maximize2 size={12} /></button>
                            <button onClick={() => downloadImage(`${BASE_URL}${vendor.panFront}`, `${vendor.name || 'vendor'}-pan-front.jpg`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Download size={12} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                    {vendor.panBack && (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <span className="block text-[8px] font-bold text-slate-400 text-center py-0.5 bg-slate-100 border-b border-slate-200">BACK</span>
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={`${BASE_URL}${vendor.panBack}`}
                            alt="PAN Back"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/250x160?text=PAN+Back"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                            <button onClick={() => setModalImage(`${BASE_URL}${vendor.panBack}`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Maximize2 size={12} /></button>
                            <button onClick={() => downloadImage(`${BASE_URL}${vendor.panBack}`, `${vendor.name || 'vendor'}-pan-back.jpg`)} className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"><Download size={12} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certificates section */}
              {vendor.professionalCertificate && vendor.professionalCertificate.length > 0 && (
                <div className="flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Uploaded Certificates</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {vendor.professionalCertificate.map((doc, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <span className="block text-[8px] font-bold text-slate-400 text-center py-0.5 bg-slate-100 border-b border-slate-200">CERTIFICATE {idx + 1}</span>
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={`${BASE_URL}${doc}`}
                            alt={`Certificate ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/250x160?text=Certificate"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                            <button 
                              onClick={() => setModalImage(`${BASE_URL}${doc}`)} 
                              className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                              title="Zoom Preview"
                            >
                              <Maximize2 size={12} />
                            </button>
                            <button 
                              onClick={() => downloadImage(`${BASE_URL}${doc}`, `${vendor.name || 'vendor'}-certificate-${idx + 1}.jpg`)} 
                              className="p-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                              title="Download Certificate"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive image lightbox modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            onClick={() => setModalImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close controls */}
              <button 
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full shadow transition-all focus:outline-none z-10"
              >
                <X size={18} />
              </button>

              <img 
                src={modalImage} 
                alt="KYC Document Preview" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />

              <div className="p-3 flex justify-between items-center text-xs font-bold text-slate-500 bg-slate-50 border-t border-slate-100">
                <span>KYC Verification Image Preview</span>
                <button
                  onClick={() => downloadImage(modalImage, 'kyc-preview.jpg')}
                  className="px-3 py-1 bg-[#0D877F] hover:bg-[#0A6B65] text-white rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <Download size={12} /> Download Full Resolution
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
