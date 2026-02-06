import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIndustryNews } from "../../Services/industryNews";
import { FiArrowLeft, FiUpload, FiImage, FiSave } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function IndustryNewsCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        content: "",
        readTime: "5 mins",
        coverImage: null, // file object
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
        if (!formData.coverImage) newErrors.coverImage = "Cover image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("shortDescription", formData.shortDescription);
            submitData.append("content", formData.content);
            submitData.append("readTime", formData.readTime);
            if (formData.coverImage) {
                submitData.append("coverImage", formData.coverImage);
            }

            const response = await createIndustryNews(submitData);

            if (response.success) {
                toast.success("News article created successfully!");
                navigate("/home/industryNews/list");
            } else {
                toast.error(response.message || "Failed to create news");
            }
        } catch (err) {
            console.error("Create error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create New Industry News</h1>
                </div>
            </div>

            {/* Form - near full width */}
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
                            placeholder="Brief summary of the article (shown in list view)..."
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

                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Cover Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Preview */}
                            <div className="w-full md:w-1/2">
                                {imagePreview || formData.coverImage ? (
                                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
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
                                        <p className="text-gray-700 font-medium mb-1">Click to upload or drag & drop</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, WEBP • Max 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {errors.coverImage && <p className="mt-2 text-sm text-red-600">{errors.coverImage}</p>}
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

                    {/* <div>
            <label htmlFor="readTime" className="block text-lg font-medium text-gray-700 mb-2">
              Read Time
            </label>
            <select
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
            >
              <option value="5 mins">5 mins</option>
              <option value="8 mins">8 mins</option>
              <option value="10 mins">10 mins</option>
              <option value="12 mins">12 mins</option>
              <option value="15 mins">15 mins</option>
              <option value="20 mins">20 mins</option>
            </select>
          </div> */}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            <FiSave size={18} />
                            {loading ? "Saving..." : "Create News Article"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}