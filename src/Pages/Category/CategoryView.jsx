import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getCategoryById } from "../../Services/categoryService";
import { formatDateTime } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await getCategoryById(id);
      setCategory(res.data);
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category details");
      navigate("/home/category");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Category Details</h1>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D877F]"></div>
              <p className="text-sm text-gray-500">Loading category details...</p>
            </div>
          ) : category ? (
            <div className="p-6 md:p-8 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{category.name}</h2>
                  <p className="text-xs text-gray-400 font-medium">Category ID: {category._id}</p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      category.status
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Image Section */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                  Category Image
                </h3>
                {category.image ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm shadow-sm bg-gray-50">
                    <img
                      src={`${BASE_URL}${category.image}`}
                      alt={category.name}
                      className="w-full h-48 object-cover object-center"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No image uploaded.</p>
                )}
              </div>

              {/* Metadata Footer */}
              <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-400 pt-6 border-t border-gray-50 gap-2">
                <span>Created: {formatDateTime(category.createdAt)}</span>
                <span>Last Updated: {formatDateTime(category.updatedAt)}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-red-500 font-medium">Category not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
