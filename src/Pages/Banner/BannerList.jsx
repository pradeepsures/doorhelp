import { useEffect, useState } from "react";
import {
    getBannerList,
    updateBanner,
    deleteBannerImageByIndex,
} from "../../Services/banner";
import { FiTrash2, FiUpload } from "react-icons/fi";
import { toast } from "react-hot-toast";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function BannerList() {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    /* ==============================
       FETCH BANNER
    ============================== */
    const fetchBanner = async () => {
        try {
            setLoading(true);
            const res = await getBannerList();
            setBanner(res?.data || null);
        } catch {
            toast.error("Failed to load banner");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    /* ==============================
       DELETE IMAGE
    ============================== */
    const handleDeleteImage = async (index) => {
        if (!window.confirm("Delete this image?")) return;

        try {
            await deleteBannerImageByIndex(banner._id, index);
            toast.success("Image deleted");
            fetchBanner();
        } catch {
            toast.error("Failed to delete image");
        }
    };

    /* ==============================
       HANDLE UPLOAD
    ============================== */
    const handleUpload = async () => {
        if (!selectedFiles.length) {
            toast.error("Select images first");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("banners", file);
        });

        try {
            await updateBanner(formData);
            toast.success("Images uploaded successfully");
            setShowModal(false);
            setSelectedFiles([]);
            setPreviewImages([]); 
            fetchBanner();
        } catch {
            toast.error("Upload failed");
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading banner...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 border">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Banner Images
                    </h1>

                    {/* ONLY ONE BUTTON */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <FiUpload size={16} /> Upload More Images
                    </button>
                </div>

                {/* IMAGE GRID */}
                {banner?.banners?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {banner.banners.map((img, index) => {
                            const imageUrl = `${FILE_BASE_URL}/${img}`;

                            return (
                                <div
                                    key={index}
                                    className="border rounded-lg p-3 shadow-sm bg-gray-50"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`banner-${index}`}
                                        className="h-40 w-full object-cover rounded-md"
                                    />

                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                                        >
                                            <FiTrash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">
                        No images available
                    </p>
                )}
            </div>

            {/* =============================
            UPLOAD MODAL
      ============================= */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">
                            Upload More Images
                        </h2>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setSelectedFiles(files);

                                // Create preview URLs
                                const previewUrls = files.map((file) =>
                                    URL.createObjectURL(file)
                                );
                                setPreviewImages(previewUrls);
                            }}
                            className="mb-4"
                        />

                        {/* IMAGE PREVIEW */}
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {previewImages.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt="preview"
                                        className="h-20 w-full object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        )}
                        {/* <input
              type="file"
              multiple
              onChange={(e) =>
                setSelectedFiles(Array.from(e.target.files))
              }
              className="mb-4"
            /> */}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}