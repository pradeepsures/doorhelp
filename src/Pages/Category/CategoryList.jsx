import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
  FiPlus,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { getCategories, deleteCategory } from "../../Services/categoryService";
import { exportToExcel } from "../../utils/exportToexcel";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function CategoryList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletedFilter, setDeletedFilter] = useState("");
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchCategories = async (currentPage, searchQuery, currentStatus, currentDeleted) => {
    try {
      setLoading(true);
      const res = await getCategories(currentPage, searchQuery, currentStatus, currentDeleted);
      setCategories(res.data || []);
      setTotalPages(res.pagination?.totalPages || res.totalPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories(page, search, statusFilter, deletedFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, deletedFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        const currentMenu = menuRefs.current[openMenuId];
        if (currentMenu && !currentMenu.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? (Deleting this category will also soft delete its subcategories)")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories(page, search, statusFilter, deletedFilter);
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setDeletedFilter("");
    setPage(1);
    toast.success("Filter reset successfully");
  };

  const handleDownloadExcel = () => {
    if (!categories.length) {
      toast.error("No data available to export");
      return;
    }
    const formattedData = categories.map((item, index) => ({
      "Sr No": index + 1,
      Name: item.name || "",
      Status: item.status ? "Active" : "Inactive",
      Deleted: item.isDeleted ? "Yes" : "No",
      "Created At": item.createdAt ? formatDate(item.createdAt) : "",
    }));
    exportToExcel(formattedData, "Categories_List");
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Categories
          </h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Deleted Filter */}
            <select
              value={deletedFilter}
              onChange={(e) => {
                setDeletedFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
            >
              <option value="">Deleted</option>
              <option value="false">False</option>
              <option value="true">True</option>
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
            >
              <FiRefreshCw /> Reset
            </button>

            {/* Export */}
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              <FiDownload /> Excel
            </button>

            {/* Create */}
            <button
              onClick={() => navigate("/home/category/create")}
              className="px-5 py-2 flex items-center justify-center whitespace-nowrap gap-2 bg-[#0D877F] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm"
            >
              <FiPlus /> Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-visible">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No categories found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Sr No</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Image</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Name</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Status</th>
                    <th className="px-6 py-4 text-left font-medium tracking-wider bg-theme-gradient-horizontal">Created Date</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider bg-theme-gradient-horizontal">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((row, index) => {
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-gray-700">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <img 
                            src={row.image ? `${BASE_URL}${row.image}` : "https://via.placeholder.com/80x40?text=No+Image"} 
                            alt={row.name} 
                            className="w-16 h-10 object-cover rounded shadow-sm border border-gray-200"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/80x40?text=No+Image" }}
                          />
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {row.name}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {row.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                          {formatDate(row.createdAt)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-3 text-right">
                          <div
                            ref={(el) => (menuRefs.current[row._id] = el)}
                            className="inline-block relative"
                          >
                            <button
                              onClick={() => toggleMenu(row._id)}
                              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                            >
                              <FiMoreVertical size={18} />
                            </button>

                            {openMenuId === row._id && (
                              <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl text-sm z-50 overflow-hidden">
                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(`/home/category/view/${row._id}`);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-[#0D877F]/10 flex items-center gap-3 text-[#0D877F] transition-colors font-medium"
                                  >
                                    <FiEye size={15} /> View
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(`/home/category/edit/${row._id}`);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-blue-600 transition-colors font-medium"
                                  >
                                    <FiEdit size={15} /> Edit
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleDelete(row._id);
                                    }}
                                    className="w-full px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors font-medium"
                                  >
                                    <FiTrash2 size={15} /> Delete
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
          {!loading && categories.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
              <div className="text-gray-500">
                Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
