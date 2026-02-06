import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIndustryNewsById, updateIndustryNewsById } from "../../Services/industryNews";
import { FiArrowLeft, FiUpload, FiImage, FiSave } from "react-icons/fi";
import { toast } from "react-hot-toast";

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms";
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


export default function IndustryNewsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    readTime: "5 mins",
    coverImage: null, // new file if changed
  });

  const [existingImage, setExistingImage] = useState(""); // URL of current image
  const [imagePreview, setImagePreview] = useState(null); // preview (existing or new)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch existing news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await getIndustryNewsById(id);
        if (res.success && res.data) {
          const news = res.data;
          setFormData({
            title: news.title || "",
            shortDescription: news.shortDescription || "",
            content: news.content || "",
            readTime: news.readTime || "5 mins",
            coverImage: null, // no new file initially
          });
          setExistingImage(news.coverImage ? `${FILE_BASE_URL}/${news.coverImage}` : "");
          setImagePreview(news.coverImage ? `${FILE_BASE_URL}/${news.coverImage}` : null);
        } else {
          toast.error("News not found");
          navigate("/home/industryNews/list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load news");
        navigate("/home/industryNews/list");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    // Note: coverImage is optional for update (keep old if not changed)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("shortDescription", formData.shortDescription);
      submitData.append("content", formData.content);
      submitData.append("readTime", formData.readTime);
      if (formData.coverImage) {
        submitData.append("coverImage", formData.coverImage); // only if new image uploaded
      }

      const response = await updateIndustryNewsById(id, submitData);

      if (response.success) {
        toast.success("News article updated successfully!");
        navigate("/home/industryNews/list");
      } else {
        toast.error(response.message || "Failed to update news");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading news data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/home/industryNews/list")}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Industry News</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <form onSubmit={handleSubmit} className="space-y-10 bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-200">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm`}
              placeholder="Enter news title..."
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="block text-lg font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={4}
              value={formData.shortDescription}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.shortDescription ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm`}
              placeholder="Brief summary of the article..."
            />
            {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
          </div>

          {/* Full Content */}
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
              Full Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.content ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm font-mono`}
              placeholder="Write the complete article here..."
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Cover Image (leave blank to keep current)
            </label>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Preview */}
              <div className="w-full md:w-1/2">
                {imagePreview ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ) : existingImage ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
                    <img
                      src={existingImage}
                      alt="Current image"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
                    <FiImage size={48} className="mb-3" />
                    <p className="text-sm">No image selected</p>
                  </div>
                )}
              </div>

              {/* Upload Area */}
              <div className="w-full md:w-1/2">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition">
                    <FiUpload size={32} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-700 font-medium mb-1">Click to upload new image (optional)</p>
                    <p className="text-sm text-gray-500">PNG, JPG, WEBP • Max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Read Time */}
          <div>
            <label htmlFor="readTime" className="block text-lg font-medium text-gray-700 mb-2">
              Read Time
            </label>
            <input
              list="readTimeOptions"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="Enter or select read time"
              className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
            />
            <datalist id="readTimeOptions">
              <option value="5 mins" />
              <option value="8 mins" />
              <option value="10 mins" />
              <option value="12 mins" />
              <option value="15 mins" />
              <option value="20 mins" />
            </datalist>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <FiSave size={18} />
              {saving ? "Updating..." : "Update News Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}