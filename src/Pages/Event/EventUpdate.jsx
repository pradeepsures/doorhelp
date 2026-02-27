import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  updateEvent,
  deleteEventImageByIndex,
} from "../../Services/event";
import { toast } from "react-hot-toast";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviewImages, setNewPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ============================
     FETCH EVENT DETAILS
  ============================ */
  const fetchDetails = async () => {
    try {
      setPageLoading(true);
      const res = await getEventById(id);
      const data = res.data;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        date: data.date ? data.date.split("T")[0] : "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
      });

      setExistingImages(data.images || []);
    } catch (err) {
      toast.error("Failed to load event details");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  /* ============================
     HANDLE INPUT CHANGE
  ============================ */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ============================
     HANDLE NEW IMAGE SELECT
  ============================ */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setNewPreviewImages((prev) => [...prev, ...previews]);
  };

  /* ============================
     REMOVE NEW IMAGE (before upload)
  ============================ */
  const removeNewImage = (index) => {
    const updatedImages = [...newImages];
    const updatedPreviews = [...newPreviewImages];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setNewImages(updatedImages);
    setNewPreviewImages(updatedPreviews);
  };

  /* ============================
     DELETE EXISTING IMAGE (API CALL)
  ============================ */
  const handleDeleteExistingImage = async (index) => {
    try {
      await deleteEventImageByIndex(id, index);

      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);

      toast.success("Image deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ============================
     SUBMIT UPDATE
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("startTime", formData.startTime);
      payload.append("endTime", formData.endTime);

      newImages.forEach((img) => {
        payload.append("images", img);
      });

      await updateEvent(id, payload);

      toast.success("Event updated successfully");
      navigate("/home/event/list");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
      </div>
    );
  }

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
            Update Event
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Existing Images</h3>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`${FILE_BASE_URL}/${img}`}
                      alt="existing"
                      className="h-24 w-24 object-cover rounded-lg border shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block font-semibold mb-2">
              Upload New Images
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

          {/* New Image Preview */}
          {newPreviewImages.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {newPreviewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded-lg border shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>

        </form>
      </div>
    </div>
  );
}