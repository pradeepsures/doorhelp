import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getCategoryById, createCategory, updateCategory } from "../../Services/categoryService";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const CategoryForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await getCategoryById(id);
      const category = res.data;
      setFormData({
        name: category.name,
        status: category.status,
      });
      if (category.image) {
        setImagePreview(`${BASE_URL}${category.image}`);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category details");
      navigate("/home/category");
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
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!isEditMode && !image) {
      toast.error("Category image is required");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("status", formData.status);
    
    if (image) {
      payload.append("image", image);
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await updateCategory(id, payload);
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload);
        toast.success("Category created successfully");
      }
      navigate("/home/category");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
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
            onClick={() => navigate("/home/category")}
            className="mr-4 p-2 bg-white rounded-full text-gray-600 hover:text-[#0D877F] shadow-sm hover:shadow transition border border-gray-100 focus:outline-none"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Category" : "Add New Category"}
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D877F]"></div>
              <p className="text-sm text-gray-500">Loading form details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cleaning, Electrician, Plumbing"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:border-[#0D877F] focus:outline-none text-sm transition duration-150"
                  required
                />
              </div>

              {/* Image Section */}
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Image {isEditMode ? <span className="text-gray-400 font-normal">(Optional - upload to replace)</span> : <span className="text-red-500">*</span>}
                </label>
                
                {imagePreview && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Category Preview" 
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
                  onClick={() => navigate("/home/category")}
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
                    isEditMode ? "Update Category" : "Create Category"
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

export default CategoryForm;
