import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLatestNoticeDetails } from "../../Services/latestNotice";
import { FiArrowLeft, FiFileText, FiCalendar } from "react-icons/fi";
import { toast } from "react-hot-toast";

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms";
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


export default function LatestNoticesView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await getLatestNoticeDetails(id);
        if (res.success && res.data) {
          setNotice(res.data);
        } else {
          toast.error("Notice not found");
          navigate("/home/latest-notices/list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load notice");
        navigate("/home/latest-notices/list");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading notice details...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">😔</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Notice Not Found</h2>
          <p className="text-gray-600 mb-8">The requested notice could not be loaded.</p>
          <button
            onClick={() => navigate("/home/latest-notices/list")}
            className="px-10 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Return to Notices List
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(notice.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - Only Back Button */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate("/home/latest-notices/list")}
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 transition font-medium text-lg"
          >
            <FiArrowLeft size={22} />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Title - Prominent at top of content */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-10 lg:mb-12 leading-tight text-center lg:text-left">
          {notice.title}
        </h1>

        {/* Cover Image */}
        <div className="mb-12 lg:mb-16 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
          {notice.coverImage ? (
            <img
              src={`${FILE_BASE_URL}/${notice.coverImage}`}
              alt={notice.title}
              className="w-full h-auto object-cover max-h-[480px] lg:max-h-[580px]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x500?text=Image+Not+Found";
                e.target.className = "w-full h-96 object-cover bg-gray-100";
              }}
            />
          ) : (
            <div className="w-full h-96 bg-gray-50 flex items-center justify-center text-gray-500 text-2xl font-medium">
              No Cover Image Available
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="mb-14 lg:mb-18 bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6">Description</h2>
          <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-line text-lg lg:text-xl">
              {notice.shortDescription || "No description available for this notice."}
            </p>
          </div>
        </div>

        {/* View PDF Button */}
        <div className="mb-14 lg:mb-18 text-center">
          {notice.pdfFile ? (
            <a
              href={`${FILE_BASE_URL}/${notice.pdfFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xl lg:text-2xl font-semibold rounded-2xl hover:from-indigo-700 hover:to-indigo-800 shadow-xl transition transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <FiFileText size={32} />
              Open PDF Document
            </a>
          ) : (
            <div className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-gray-100 text-gray-600 text-xl lg:text-2xl font-semibold rounded-2xl">
              <FiFileText size={32} />
              No PDF Attached
            </div>
          )}
        </div>

        {/* Metadata - Popular & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${notice.isPopular ? "bg-green-100" : "bg-gray-100"}`}>
              <span className="text-xl lg:text-2xl font-bold">
                {notice.isPopular ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <p className="text-sm lg:text-base text-gray-500">Popular Notice</p>
              <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                {notice.isPopular ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-indigo-100">
              <FiCalendar size={28} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm lg:text-base text-gray-500">Published On</p>
              <p className="text-xl lg:text-2xl font-semibold text-gray-900">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}