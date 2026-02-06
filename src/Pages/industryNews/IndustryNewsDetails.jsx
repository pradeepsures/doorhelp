import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIndustryNewsById } from "../../Services/industryNews";
import { FiArrowLeft, FiClock, FiCalendar } from "react-icons/fi";
import { toast } from "react-hot-toast";

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms";
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


export default function IndustryNewsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        const res = await getIndustryNewsById(id);
        if (res.success && res.data) {
          setNewsItem(res.data);
        } else {
          toast.error("News article not found");
          navigate("/admin/industry-news");
        }
      } catch (err) {
        console.error("Fetch single news error:", err);
        toast.error("Failed to load news article");
        navigate("/admin/industry-news");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Article not found</h2>
          <button
            onClick={() => navigate("/admin/industry-news")}
            className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Back to News List
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(newsItem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back & Meta Bar */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/home/industryNews/list")}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            <FiArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <FiClock size={18} className="text-indigo-600" />
              {newsItem.readTime}
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar size={18} className="text-indigo-600" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Title - Big & Prominent */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
          {newsItem.title}
        </h1>

        {/* Cover Image - Full width, nice height */}
        <div className="mb-10 lg:mb-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          {newsItem.coverImage ? (
            <img
              src={`${FILE_BASE_URL}/${newsItem.coverImage}`}
              alt={newsItem.title}
              className="w-full h-auto object-cover max-h-[600px] lg:max-h-[700px]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x600?text=Image+Not+Available";
                e.target.className = "w-full h-80 object-cover bg-gray-100";
              }}
            />
          ) : (
            <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-medium">
              No Cover Image Available
            </div>
          )}
        </div>

        {/* Short Description / Summary */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Summary</h2>
          <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-line">{newsItem.shortDescription}</p>
          </div>
        </div>

        {/* Full Content */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Full Article</h2>
          <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed">
            {newsItem.content && newsItem.content.trim() ? (
              <div className="whitespace-pre-line">{newsItem.content}</div>
            ) : (
              <p className="text-gray-500 italic text-lg">
                No detailed content available for this article.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}