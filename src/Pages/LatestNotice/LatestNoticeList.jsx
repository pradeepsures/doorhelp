import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLatestNoticesList,    
  deleteLatestNotice,      
} from "../../Services/latestNotice"
import { FiEdit, FiEye, FiTrash2, FiMoreVertical, FiPlus, FiSearch, FiFileText } from "react-icons/fi";
import { toast } from "react-hot-toast";

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms";
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


export default function LatestNoticesList() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10;

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await getLatestNoticesList({ page, limit, search });
      setNotices(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load latest notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page, search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await deleteLatestNotice(id);
      toast.success("Notice deleted successfully");
      setOpenMenuId(null);
      fetchNotices();
    } catch (err) {
      toast.error("Failed to delete notice");
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Latest Notices</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button
            onClick={() => navigate("/home/latest-notices/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition font-medium"
          >
            <FiPlus size={18} /> Add Notice
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📪</div>
            <p className="text-xl font-medium">No notices found</p>
            {search && <p className="mt-3">Try adjusting your search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-14">Sr No</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-32">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider min-w-[220px]">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider min-w-[280px]">Short Description</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-28">PDF</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-28">Popular</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-36">Published</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-white bg-primary-gradient uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((item, index) => {
                  const serialNo = (page - 1) * limit + index + 1;
                  const shortDesc = item.shortDescription || "No description available";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{serialNo}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.coverImage ? (
                          <img
                            src={`${FILE_BASE_URL}/${item.coverImage}`}
                            alt={item.title}
                            className="h-16 w-24 object-cover rounded-md shadow-sm border border-gray-200"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="h-16 w-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs border border-gray-200">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {shortDesc.substring(0, 180)}
                          {shortDesc.length > 180 && "..."}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.pdfFile ? (
                          <a
                            href={`${FILE_BASE_URL}/${item.pdfFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                          >
                            <FiFileText size={16} /> View PDF
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">No PDF</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${
                            item.isPopular
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {item.isPopular ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div ref={(el) => (menuRefs.current[item._id] = el)}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(item._id);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
                          >
                            <FiMoreVertical className="text-gray-600" size={20} />
                          </button>

                          {openMenuId === item._id && (
                            <ul className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm overflow-hidden">
                              <li>
                                <button
                                  onClick={() => {
                                    navigate(`/home/latest-notices/view/${item._id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-blue-700 font-medium"
                                >
                                  <FiEye size={16} /> View
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    navigate(`/home/latest-notices/edit/${item._id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-green-700 font-medium"
                                >
                                  <FiEdit size={16} /> Edit
                                </button>
                              </li>
                              <li className="border-t border-gray-100 my-1"></li>
                              <li>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2.5 text-red-700 font-medium"
                                >
                                  <FiTrash2 size={16} /> Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && notices.length > 0 && totalPage > 1 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPage}</span>
              <span className="ml-2 text-gray-500">({notices.length} items on this page)</span>
            </div>
            <div className="flex gap-3 order-1 sm:order-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition font-medium text-sm disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page === totalPage}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition font-medium text-sm disabled:cursor-not-allowed"
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