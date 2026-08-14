import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Info, 
  TrendingUp, 
  Wrench, 
  UserCheck, 
  Package, 
  Edit3, 
  Layers,
  ChevronRight,
  Plus,
  Maximize2,
  Download,
  X
} from "lucide-react";
import { getSubcategoryById } from "../../Services/subcategoryService";
import { formatDateTime } from "../../utils/dateFormatter";
import { formatStatus } from "../../utils/stringFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Reusable DetailRow Component, modified to return null if value is not present
const DetailRow = ({ label, value }) => {
  if (value === undefined || value === null || value === "" || value === "N/A" || value === "Not specified") {
    return null;
  }
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-b-0 gap-4">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
};

const SubcategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchSubcategory();
  }, [id]);

  const fetchSubcategory = async () => {
    try {
      setLoading(true);
      const res = await getSubcategoryById(id);
      setSubcategory(res.data);
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      toast.error("Failed to load subcategory details");
      navigate("/home/subcategory");
    } finally {
      setLoading(false);
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

  // Calculate discount if original price is present
  const discountPercentage = 
    subcategory?.originalPrice && subcategory?.price
      ? Math.round(((subcategory.originalPrice - subcategory.price) / subcategory.originalPrice) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-3 md:p-5 text-slate-700 space-y-4">
      {/* Breadcrumbs & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Services</span>
            <ChevronRight size={10} />
            <Link to="/home/subcategory" className="hover:text-[#0D877F] transition-colors">Sub Category</Link>
            <ChevronRight size={10} />
            <span className="text-slate-600">Details</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/home/subcategory")}
              className="p-1.5 bg-slate-50 rounded-lg text-slate-500 hover:text-[#0D877F] hover:bg-slate-100 border border-slate-200/50 transition-all focus:outline-none"
              title="Go Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "Loading Details..." : subcategory?.name}
            </h1>
          </div>
        </div>

        {/* Quick Action Header Buttons */}
        {!loading && subcategory && (
          <div className="flex items-center gap-2">
            <Link
              to={`/home/subcategory/${subcategory._id}/included-services`}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-[#0D877F] hover:text-[#0D877F] text-slate-700 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Layers size={14} />
              <span>Manage Services</span>
            </Link>
            <Link
              to={`/home/subcategory/edit/${subcategory._id}`}
              className="px-3.5 py-2 bg-[#0D877F] hover:bg-[#0A6B65] text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Edit3 size={14} />
              <span>Edit Subcategory</span>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0D877F] animate-spin"></div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Retrieving subcategory details...</p>
        </div>
      ) : subcategory ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* CARD 1: GENERAL INFORMATION */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Package size={13} className="text-[#0D877F]" /> General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              {/* Left Column */}
              <div className="space-y-1">
                <DetailRow 
                  label="Parent Category" 
                  value={subcategory.categoryId?.name} 
                />
                <DetailRow 
                  label="Status" 
                  value={
                    subcategory.status !== undefined && subcategory.status !== null ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        subcategory.status
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${subcategory.status ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {subcategory.status ? "Active" : "Inactive"}
                      </span>
                    ) : null
                  } 
                />
                <DetailRow 
                  label="Created On" 
                  value={formatDateTime(subcategory.createdAt)} 
                />
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                <DetailRow 
                  label="Booking Base Price" 
                  value={
                    subcategory.price !== undefined && subcategory.price !== null ? (
                      <span className="text-base font-extrabold text-[#0D877F]">
                        ₹{subcategory.price}
                      </span>
                    ) : null
                  } 
                />
                <DetailRow 
                  label="Original Base Price" 
                  value={
                    subcategory.originalPrice ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 line-through text-xs">₹{subcategory.originalPrice}</span>
                        {discountPercentage > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-100">
                            {discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    ) : null
                  } 
                />
                <DetailRow 
                  label="Last Modified" 
                  value={formatDateTime(subcategory.updatedAt)} 
                />
              </div>
            </div>
          </div>

          {/* CARD 2: DESCRIPTION & MEDIA */}
          {(subcategory.description || subcategory.image) && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Info size={13} className="text-[#0D877F]" /> Description & Banner Media
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Description text */}
                {subcategory.description && (
                  <div className="lg:col-span-8 bg-slate-50/50 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-center">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Detailed Summary</span>
                    <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                      {subcategory.description}
                    </p>
                  </div>
                )}

                {/* Subcategory Image */}
                {subcategory.image && (
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Media Banner</span>
                    <div className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 h-32 md:h-36">
                      <img
                        src={`${BASE_URL}${subcategory.image}`}
                        alt={subcategory.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                      
                      {/* Hover tools */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                        <button
                          onClick={() => setModalImage(`${BASE_URL}${subcategory.image}`)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                          title="Zoom Image"
                        >
                          <Maximize2 size={14} />
                        </button>
                        <button
                          onClick={() => downloadImage(`${BASE_URL}${subcategory.image}`, `${subcategory.name || 'subcategory'}-banner.jpg`)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                          title="Download Image"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARD 3: SPECIFICATIONS & REQUIREMENTS */}
          {((subcategory.userRequirements && subcategory.userRequirements.length > 0) || 
            (subcategory.equipments && subcategory.equipments.length > 0)) && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Wrench size={13} className="text-[#0D877F]" /> Service Guidelines & Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* User Requirements */}
                {subcategory.userRequirements && subcategory.userRequirements.length > 0 && (
                  <div className="bg-teal-50/20 rounded-xl border border-teal-100/50 p-3.5 space-y-2">
                    <h4 className="text-[10px] font-bold text-[#0D877F] uppercase tracking-widest flex items-center gap-1.5">
                      <UserCheck size={14} />
                      <span>Required from Customer</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {subcategory.userRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 size={13} className="text-[#0D877F] mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Equipments Provided */}
                {subcategory.equipments && subcategory.equipments.length > 0 && (
                  <div className="bg-blue-50/15 rounded-xl border border-blue-100/50 p-3.5 space-y-2">
                    <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Wrench size={14} />
                      <span>Equipments Provided by Partner</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {subcategory.equipments.map((eq, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 size={13} className="text-blue-500 mt-0.5 shrink-0" />
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARD 4: INCLUDED SERVICES GRID */}
          {subcategory.includedServices && subcategory.includedServices.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    What's Included in Services
                  </h3>
                  <span className="px-2 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                    {subcategory.includedServices.length} Items
                  </span>
                </div>
                
                <Link
                  to={`/home/subcategory/${subcategory._id}/included-services`}
                  className="text-[10px] font-bold text-[#0D877F] hover:underline flex items-center gap-0.5"
                >
                  <Plus size={12} /> Manage Included Items
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subcategory.includedServices.map((service, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -2, boxShadow: "0 6px 12px -2px rgba(0, 0, 0, 0.04)" }}
                    className="flex gap-3 bg-slate-50 border border-slate-100 hover:border-[#0D877F]/20 rounded-xl p-3 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white relative">
                      <img 
                        src={`${BASE_URL}${service.image}`} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=Service" }}
                      />
                      
                      {/* Controls hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white">
                        <button
                          onClick={() => setModalImage(`${BASE_URL}${service.image}`)}
                          className="p-0.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                          title="Zoom"
                        >
                          <Maximize2 size={10} />
                        </button>
                        <button
                          onClick={() => downloadImage(`${BASE_URL}${service.image}`, `${subcategory.name}-${service.title}.jpg`)}
                          className="p-0.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded transition"
                          title="Download"
                        >
                          <Download size={10} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{service.title}</h4>
                      {service.description && (
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{service.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      ) : (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <XCircle size={36} className="text-rose-500 mb-2" />
          <h2 className="text-base font-bold text-slate-800">Subcategory Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            We couldn't retrieve the details. The category may have been deleted.
          </p>
          <button 
            onClick={() => navigate("/home/subcategory")}
            className="mt-3 px-3.5 py-1.5 bg-[#0D877F] text-white rounded-lg text-xs font-bold hover:bg-opacity-95 transition"
          >
            Back to Subcategories
          </button>
        </div>
      )}

      {/* Lightbox / Modal Image Portal */}
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
                alt="Image Preview" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />

              <div className="p-3 flex justify-between items-center text-xs font-bold text-slate-500 bg-slate-50 border-t border-slate-100">
                <span>Subcategory Media Review</span>
                <button
                  onClick={() => downloadImage(modalImage, 'subcategory-preview.jpg')}
                  className="px-3 py-1 bg-[#0D877F] hover:bg-[#0A6B65] text-white rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <Download size={12} /> Download Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SubcategoryView;
