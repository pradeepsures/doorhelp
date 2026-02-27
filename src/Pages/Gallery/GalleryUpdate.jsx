import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGalleryById, updateGallery, deleteGalleryImage } from "../../Services/gallery";
import { toast } from "react-hot-toast";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function EditGallery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [removedIndexes, setRemovedIndexes] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 Fetch Data
  const fetchDetails = async () => {
    try {
      const res = await getGalleryById(id);
      const data = res.data;

      setTitle(data.title);
      setIsActive(data.isActive);
      setExistingImages(data.images || []);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // 🔥 Remove Existing Image
  const handleRemoveExisting = async (index) => {
  try {
    await deleteGalleryImage(id, index);

    // Update UI after success
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    toast.success("Image deleted successfully");
  } catch (err) {
    toast.error(err.message || "Delete failed");
  }
};
//   const handleRemoveExisting = (index) => {
//     setRemovedIndexes((prev) => [...prev, index]);

//     setExistingImages((prev) =>
//       prev.filter((_, i) => i !== index)
//     );
//   };

  // 🔥 Handle New Image Select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setNewImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previews);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // 🔥 Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("isActive", isActive);

      // Send removed image indexes
      if (removedIndexes.length > 0) {
        formData.append(
          "updateIndexes",
          JSON.stringify(removedIndexes)
        );
      }

      // Append new images
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await updateGallery(id, formData);

      toast.success("Gallery updated successfully");
      navigate("/home/gallery/list");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/home/gallery/lis")}
            className="flex items-center gap-2 text-indigo-600 font-medium"
          >
            <FiArrowLeft /> Back
          </button>

          <h2 className="text-xl font-bold text-gray-800">
            Edit Gallery
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-sm">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-semibold text-sm">
              Status
            </label>
            <select
              value={isActive}
              onChange={(e) =>
                setIsActive(e.target.value === "true")
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* Existing Images */}
          <div>
            <h4 className="font-semibold mb-3">
              Existing Images
            </h4>

            {existingImages.length > 0 ? (
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
                      onClick={() =>
                        handleRemoveExisting(index)
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No existing images
              </p>
            )}
          </div>

          {/* Upload New Images */}
          <div>
            <label className="block mb-2 font-semibold text-sm">
              Add New Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Preview New Images */}
          {previewImages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">
                New Image Preview
              </h4>
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
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/home/gallery/list")}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Gallery"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}