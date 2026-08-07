import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getSubcategoryById, createSubcategory, updateSubcategory } from "../../Services/subcategoryService";
import { getCategories } from "../../Services/categoryService";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const SubcategoryForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    status: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch active categories to populate dropdown
  useEffect(() => {
    const fetchActiveCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await getCategories(1, "", "true", "false", 100);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
        toast.error("Failed to load category list");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchActiveCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchSubcategory();
    }
  }, [id]);

  const fetchSubcategory = async () => {
    try {
      setLoading(true);
      const res = await getSubcategoryById(id);
      const sub = res.data;
      setFormData({
        categoryId: sub.categoryId?._id || sub.categoryId || "",
        name: sub.name,
        description: sub.description || "",
        price: sub.price,
        originalPrice: sub.originalPrice || "",
        status: sub.status,
      });
      if (sub.image) {
        setImagePreview(`${BASE_URL}${sub.image}`);
      }
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      toast.error("Failed to load subcategory details");
      navigate("/home/subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Parent category is required");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Price must be a valid positive number");
      return;
    }
    if (formData.originalPrice !== "" && Number(formData.originalPrice) < 0) {
      toast.error("Original price cannot be negative");
      return;
    }
    if (!isEditMode && !image) {
      toast.error("Subcategory image is required");
      return;
    }

    const payload = new FormData();
    payload.append("categoryId", formData.categoryId);
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("price", Number(formData.price));
    if (formData.originalPrice !== "") {
      payload.append("originalPrice", Number(formData.originalPrice));
    }
    payload.append("status", formData.status);
    
    if (image) {
      payload.append("image", image);
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await updateSubcategory(id, payload);
        toast.success("Subcategory updated successfully");
      } else {
        await createSubcategory(payload);
        toast.success("Subcategory created successfully");
      }
      navigate("/home/subcategory");
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast.error(error.message || "Failed to save subcategory");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 w-full">
      <div className="max-w-3xl mx-auto">
        {/* Back Button and Title */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/home/subcategory")}
            className="mr-4 p-2 bg-white rounded-full text-gray-600 hover:text-[#0D877F] shadow-sm hover:shadow transition border border-gray-100 focus:outline-none"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
          {loading || categoriesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D877F]"></div>
              <p className="text-sm text-gray-500">Loading form details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm bg-white transition duration-150"
                  required
                >
                  <option value="" disabled>Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. House Cleaning, Fan Repair"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief description of the subcategory service..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                />
              </div>

              {/* Prices Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="any"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original Price (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="any"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subcategory Image {isEditMode ? <span className="text-gray-400 font-normal">(Optional - upload to replace)</span> : <span className="text-red-500">*</span>}
                </label>
                
                {imagePreview && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Subcategory Preview" 
                      className="w-48 h-32 object-cover rounded-lg shadow-sm border border-gray-200 bg-white" 
                    />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0D877F]/10 file:text-[#0D877F] hover:file:bg-[#0D877F]/20 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg bg-white p-1"
                />
              </div>

              {/* Status Switch Toggle */}
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0D877F]/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D877F]"></div>
                  <span className="ms-3 text-sm font-semibold text-gray-700">Active Status</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/home/subcategory")}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0D877F] text-white rounded-lg hover:bg-[#0b7069] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold shadow focus:outline-none"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    isEditMode ? "Update Subcategory" : "Create Subcategory"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryForm;
