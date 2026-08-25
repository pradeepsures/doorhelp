import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { 
  getVariants, 
  createVariant, 
  updateVariant, 
  deleteVariant,
  getSubcategoryById 
} from "../../Services/subcategoryService";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function VariantManager() {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();

  const [subcategory, setSubcategory] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Array Inputs
  const [userRequirements, setUserRequirements] = useState([]);
  const [userReqInput, setUserReqInput] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [equipmentInput, setEquipmentInput] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const subRes = await getSubcategoryById(subCategoryId);
      setSubcategory(subRes.data);

      const variantsRes = await getVariants(subCategoryId);
      setVariants(variantsRes.data || []);
    } catch (err) {
      console.error("Error loading variants:", err);
      toast.error(err.message || "Failed to load subcategory variants");
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
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("");
    setStatus(true);
    setImage(null);
    setImagePreview("");
    setUserRequirements([]);
    setUserReqInput("");
    setEquipments([]);
    setEquipmentInput("");
  };

  const handleEditClick = (variant) => {
    setEditingId(variant._id);
    setName(variant.name);
    setDescription(variant.description || "");
    setPrice(variant.price);
    setOriginalPrice(variant.originalPrice || "");
    setStatus(variant.status);
    setImage(null);
    setImagePreview(variant.image ? `${BASE_URL}${variant.image}` : "");
    setUserRequirements(variant.userRequirements || []);
    setEquipments(variant.equipments || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;

    try {
      await deleteVariant(id);
      toast.success("Variant deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete variant");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Variant name is required");
      return;
    }

    if (price === "" || Number(price) < 0) {
      toast.error("Valid positive price is required");
      return;
    }

    if (!editingId && !image) {
      toast.error("An image is required to create a variant");
      return;
    }

    const payload = new FormData();
    payload.append("name", name.trim());
    payload.append("description", description.trim());
    payload.append("price", Number(price));
    if (originalPrice !== "") {
      payload.append("originalPrice", Number(originalPrice));
    }
    payload.append("status", status);
    payload.append("userRequirements", JSON.stringify(userRequirements));
    payload.append("equipments", JSON.stringify(equipments));
    
    if (image) {
      payload.append("image", image);
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateVariant(editingId, payload);
        toast.success("Variant updated successfully");
      } else {
        await createVariant(subCategoryId, payload);
        toast.success("Variant added successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to save variant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRequirement = () => {
    if (userReqInput.trim()) {
      setUserRequirements([...userRequirements, userReqInput.trim()]);
      setUserReqInput("");
    }
  };

  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setEquipments([...equipments, equipmentInput.trim()]);
      setEquipmentInput("");
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Flow Variants</h1>
            {subcategory && (
              <p className="text-sm text-gray-500 font-medium">
                Add and edit variants for subcategory: <span className="text-[#0D877F] font-semibold">{subcategory.name}</span>
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D877F]"></div>
            <p className="text-sm text-gray-500">Loading variants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List Section (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Existing Variants ({variants.length})
                </h2>

                {variants.length === 0 ? (
                  <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="font-semibold text-gray-500">No variants added yet</p>
                    <p className="text-xs mt-1 text-gray-400">Use the form on the right to add flow variants (e.g. Gas Refill, No Cooling).</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {variants.map((v) => (
                      <div 
                        key={v._id} 
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative h-40 bg-gray-50 overflow-hidden">
                            <img 
                              src={`${BASE_URL}${v.image}`} 
                              alt={v.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/300x160?text=No+Image" }}
                            />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded font-bold">
                              ₹{v.price} {v.originalPrice && <span className="line-through text-gray-300 font-normal ml-1">₹{v.originalPrice}</span>}
                            </div>
                            {!v.status && (
                              <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                                Inactive
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-bold text-gray-800 text-base leading-tight">{v.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {v.description || "No description provided."}
                            </p>
                            
                            {/* Requirements & Equipments badges */}
                            {v.userRequirements && v.userRequirements.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {v.userRequirements.map((r, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-[#0D877F]/5 text-[#0D877F] rounded text-[10px] font-medium border border-[#0D877F]/10">
                                    Req: {r}
                                  </span>
                                ))}
                              </div>
                            )}
                            {v.equipments && v.equipments.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {v.equipments.map((eq, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium border border-blue-100">
                                    Eq: {eq}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-50 px-4 py-3 bg-gray-50/50 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(v)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition duration-150 text-xs font-semibold flex items-center gap-1"
                          >
                            <FiEdit size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition duration-150 text-xs font-semibold flex items-center gap-1"
                          >
                            <FiTrash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Section (Right column) */}
            <div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {editingId ? "Edit Variant" : "Add Variant"}
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Variant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Gas Leak Repair & Refill"
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
                      placeholder="Brief details about this specific service flow..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                    />
                  </div>

                  {/* Pricing (Grid) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Variant Image {editingId ? "(Optional)" : <span className="text-red-500">*</span>}
                    </label>
                    {imagePreview && (
                      <div className="mb-2 relative">
                        <img 
                          src={imagePreview} 
                          alt="Variant Preview" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-200" 
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0D877F]/10 file:text-[#0D877F] hover:file:bg-[#0D877F]/20 cursor-pointer border border-gray-300 rounded-lg p-1 bg-white"
                    />
                  </div>

                  {/* Array inputs: User requirements */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      User Requirements
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={userReqInput}
                        onChange={(e) => setUserReqInput(e.target.value)}
                        placeholder="Add tag..."
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-[#0D877F] focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRequirement();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddRequirement}
                        className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {userRequirements.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                          {r}
                          <button type="button" onClick={() => setUserRequirements(userRequirements.filter((_, idx) => idx !== i))} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Array inputs: Equipments */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Equipments Provided
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={equipmentInput}
                        onChange={(e) => setEquipmentInput(e.target.value)}
                        placeholder="Add tag..."
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-[#0D877F] focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddEquipment();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddEquipment}
                        className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {equipments.map((eq, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                          {eq}
                          <button type="button" onClick={() => setEquipments(equipments.filter((_, idx) => idx !== i))} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center pt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0D877F]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D877F]"></div>
                      <span className="ms-3 text-xs font-bold uppercase tracking-wider text-gray-500">Active Status</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-4 py-2.5 bg-[#0D877F] text-white rounded-lg hover:bg-[#0b7069] disabled:opacity-50 transition text-sm font-semibold shadow-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : editingId ? (
                      "Update Variant"
                    ) : (
                      "Create Variant"
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
