import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../Services/event";
import { toast } from "react-hot-toast";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";

export default function CreateEvent() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

      // reset form
        const resetForm = () => {
            setFormData({
                title: "",
                description: "",
                date: "",
                startTime: "",
                endTime: "",
            });

            setImages([]);
            setPreviewImages([]);
        };

    // Handle image select
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prev) => [...prev, ...files]);

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewImages((prev) => [...prev, ...previews]);
    };

    // Remove selected image
    const removeImage = (index) => {
        const updatedImages = [...images];
        const updatedPreviews = [...previewImages];

        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date) {
            toast.error("Title and Date are required");
            return;
        }


        try {
            setLoading(true);

            const payload = new FormData();

            payload.append("title", formData.title);
            payload.append("description", formData.description);
            payload.append("date", formData.date);
            payload.append("startTime", formData.startTime);
            payload.append("endTime", formData.endTime);

            images.forEach((img) => {
                payload.append("images", img);
            });

            await createEvent(payload);

            toast.success("Event created successfully");
            navigate("/home/event/list");

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/home/event/list")}
                        className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                    >
                        <FiArrowLeft /> Back
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Event
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter event title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter event description"
                        />
                    </div>

                    {/* Date + Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <label className="block font-semibold mb-2">
                                Event Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>

                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Upload Images
                        </label>

                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500">
                            <FiUpload />
                            <span>Select Multiple Images</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Image Preview */}
                    {previewImages.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {previewImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt="preview"
                                        className="h-24 w-24 object-cover rounded-lg border shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Event"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                        >
                            Clear
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}