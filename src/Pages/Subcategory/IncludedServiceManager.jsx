import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { 
  getIncludedServices, 
  createIncludedService, 
  updateIncludedService, 
  deleteIncludedService,
  getSubcategoryById 
} from "../../Services/subcategoryService";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function IncludedServiceManager() {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();

  const [subcategory, setSubcategory] = useState(null);
  const [includedServices, setIncludedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const subRes = await getSubcategoryById(subCategoryId);
      setSubcategory(subRes.data);

      const servicesRes = await getIncludedServices(subCategoryId);
      setIncludedServices(servicesRes.data || []);
    } catch (err) {
      console.error("Error loading included services:", err);
      toast.error(err.message || "Failed to load details");
      navigate("/home/subcategory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subCategoryId]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview("");
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setTitle(service.title);
    setDescription(service.description || "");
    setImage(null);
    setImagePreview(service.image ? `${BASE_URL}${service.image}` : "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this included service?")) return;

    try {
      await deleteIncludedService(id);
      toast.success("Included service deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete included service");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!editingId && !image) {
      toast.error("An image is required to add an included service");
      return;
    }

    const payload = new FormData();
    payload.append("title", title.trim());
    payload.append("description", description.trim());
    if (image) {
      payload.append("image", image);
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateIncludedService(editingId, payload);
        toast.success("Included service updated successfully");
      } else {
        await createIncludedService(subCategoryId, payload);
        toast.success("Included service added successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to save included service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Back and Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/home/subcategory")}
            className="mr-4 p-2 bg-white rounded-full text-gray-600 hover:text-[#0D877F] shadow-sm hover:shadow transition border border-gray-100 focus:outline-none"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Include Services</h1>
            {subcategory && (
              <p className="text-sm text-gray-500 font-medium">
                Manage what is included in: <span className="text-[#0D877F] font-semibold">{subcategory.name}</span>
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D877F]"></div>
            <p className="text-sm text-gray-500">Loading included services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List Section (Left 2 columns on lg screens) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Currently Included ({includedServices.length})
                </h2>

                {includedServices.length === 0 ? (
                  <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="font-medium">No services included yet</p>
                    <p className="text-xs mt-1">Use the form on the right to add what is included in this subcategory.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {includedServices.map((service) => (
                      <div 
                        key={service._id} 
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Image */}
                          <div className="relative h-40 bg-gray-50 overflow-hidden">
                            <img 
                              src={`${BASE_URL}${service.image}`} 
                              alt={service.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/300x160?text=No+Image" }}
                            />
                            {!service.status && (
                              <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                                Inactive
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 text-base mb-1">{service.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                              {service.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        {/* Actions footer */}
                        <div className="border-t border-gray-50 px-4 py-3 bg-gray-50/50 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(service)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition duration-150 text-xs font-semibold flex items-center gap-1"
                          >
                            <FiEdit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition duration-150 text-xs font-semibold flex items-center gap-1"
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Section (Right 1 column on lg screens) */}
            <div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {editingId ? "Edit Included Service" : "Add Included Service"}
                  </h2>
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Bathroom deep cleaning"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Briefly state what is included in this service..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                    />
                  </div>

                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Image {editingId ? "(Optional - upload to replace)" : <span className="text-red-500">*</span>}
                    </label>
                    
                    {imagePreview ? (
                      <div className="mb-3 relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover object-center"
                        />
                        <button
                          type="button"
                          onClick={() => { setImage(null); setImagePreview(""); }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 bg-gray-50 hover:bg-gray-100/50 cursor-pointer transition group">
                        <MdCloudUpload className="text-3xl text-gray-400 group-hover:text-[#0D877F] transition-colors mb-2" />
                        <span className="text-xs text-gray-500 font-semibold group-hover:text-gray-700">
                          Click to upload image
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-[#0D877F] hover:bg-[#0b7069] text-white rounded-lg transition duration-150 text-sm font-semibold shadow disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiPlus /> {editingId ? "Update Included Service" : "Add Included Service"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
