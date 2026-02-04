import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getIndustryNewsList,
  deleteIndustryNews,
} from "../../Services/industryNews";
import { FiEdit, FiEye, FiTrash2, FiMoreVertical, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function IndustryNewsList() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10; // You can change this (5, 10, 15, 20...)

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await getIndustryNewsList({
        page,
        limit,
        search,
      });
      setNews(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load industry news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;

    try {
      await deleteIndustryNews(id);
      toast.success("News deleted successfully");
      fetchNews();
    } catch (err) {
      toast.error("Failed to delete news");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Industry News</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => navigate("/admin/industry-news/create")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition"
          >
            <FiPlus size={18} /> Add News
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading industry news...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg">No news articles found</p>
            {search && <p className="mt-2">Try adjusting your search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Read Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    {/* Image Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.coverImage ? (
                        <img
                          src={`/${item.coverImage.replace(/^public\//, "")}`}
                          alt={item.title}
                          className="h-16 w-24 object-cover rounded shadow-sm"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* Title + Short Desc */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.shortDescription || "No description available"}
                      </div>
                    </td>

                    {/* Read Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.readTime}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <FiMoreVertical className="text-gray-600" />
                        </button>

                        <ul className="dropdown-menu absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm">
                          <li>
                            <button
                              onClick={() => navigate(`/admin/industry-news/view/${item._id}`)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-blue-700"
                            >
                              <FiEye size={16} /> View
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => navigate(`/admin/industry-news/edit/${item._id}`)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-green-700"
                            >
                              <FiEdit size={16} /> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-red-700"
                            >
                              <FiTrash2 size={16} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPage > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t bg-gray-50">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPage}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page === totalPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}