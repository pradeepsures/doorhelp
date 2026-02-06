import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLatestNoticeDetails, updateLatestNotice } from "../../Services/latestNotice";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiUpload, FiFileText, FiImage, FiCalendar } from "react-icons/fi";

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms"; // adjust if needed
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


export default function LatestNoticeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [coverImage, setCoverImage] = useState(null);           // new file
  const [coverPreview, setCoverPreview] = useState(null);       // preview (new or existing)
  const [pdfFile, setPdfFile] = useState(null);                 // new file
  const [pdfFileName, setPdfFileName] = useState("");           // display name
  const [existingCoverUrl, setExistingCoverUrl] = useState(""); // for display
  const [existingPdfUrl, setExistingPdfUrl] = useState("");     // for reference
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing notice
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setFetching(true);
        const res = await getLatestNoticeDetails(id);
        if (res.success && res.data) {
          const notice = res.data;
          setTitle(notice.title || "");
          setShortDescription(notice.shortDescription || "");
          setIsPopular(!!notice.isPopular);

          // Cover preview from server
          if (notice.coverImage) {
            const url = `${FILE_BASE_URL}/${notice.coverImage}`;
            setCoverPreview(url);
            setExistingCoverUrl(url);
          }

          // PDF name from server
          if (notice.pdfFile) {
            setPdfFileName(notice.pdfFile.split("/").pop() || "document.pdf");
            setExistingPdfUrl(`${FILE_BASE_URL}/${notice.pdfFile}`);
          }
        } else {
          toast.error("Notice not found");
          navigate("/home/latest-notices/list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load notice data");
        navigate("/home/latest-notices/list");
      } finally {
        setFetching(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  // Handle new cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image size must be less than 5MB");

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Handle new PDF upload
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") return toast.error("Please select a PDF file");
    if (file.size > 10 * 1024 * 1024) return toast.error("PDF size must be less than 10MB");

    setPdfFile(file);
    setPdfFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!shortDescription.trim()) return toast.error("Short description is required");


    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("shortDescription", shortDescription);
      formData.append("isPopular", isPopular);

      // Only append files if new ones are selected
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      if (pdfFile) {
        formData.append("pdfFile", pdfFile);
      }

      const response = await updateLatestNotice(id, formData);

      if (response.success) {
        toast.success("Latest notice updated successfully!");
        navigate("/home/latest-notices/list");
      } else {
        toast.error(response.message || "Failed to update notice");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading notice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <button
            onClick={() => navigate("/home/latest-notices/list")}
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 font-medium transition text-lg"
          >
            <FiArrowLeft size={22} />
            Back
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Edit Latest Notice</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            {/* 1. Title */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Notice Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
                placeholder="e.g., GST Update Q4 2025"
                required
              />
            </div>

            {/* 2. Short Description */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm resize-y"
                placeholder="Brief summary of the notice..."
                required
              />
            </div>

            {/* 3. Cover Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition cursor-pointer bg-gray-50">
                  <label className="cursor-pointer">
                    <FiUpload size={40} className="mx-auto mb-4 text-indigo-600" />
                    <p className="text-lg font-medium text-gray-800">
                      {coverPreview ? "Click to replace cover image" : "Click to upload cover image"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG, WEBP (max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center justify-center">
                {coverPreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-80 object-cover rounded-2xl shadow-xl border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x320?text=Image+Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview(existingCoverUrl || null);
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 w-full max-w-md">
                    <FiImage size={80} className="mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-medium">Image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. PDF Upload */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                PDF Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-indigo-400 transition cursor-pointer bg-gray-50">
                <label className="cursor-pointer">
                  <FiFileText size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-lg font-medium text-gray-800">
                    {pdfFileName ? `Selected: ${pdfFileName}` : "Click to replace PDF (optional)"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">PDF only (max 10MB) – leave empty to keep current</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </label>
              </div>
              {existingPdfUrl && !pdfFile && (
                <p className="mt-3 text-sm text-indigo-600">
                  Current file available →{" "}
                  <a href={existingPdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    view existing PDF
                  </a>
                </p>
              )}
            </div>

            {/* 5. Is Popular */}
            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200">
              <div>
                <label className="block text-xl font-semibold text-gray-800">Mark as Popular</label>
                <p className="text-gray-600">Popular notices appear highlighted on the dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-16 h-10 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-9 after:w-9 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xl font-bold rounded-2xl hover:from-indigo-700 hover:to-indigo-800 shadow-xl transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Notice"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}