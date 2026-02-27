import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToexcel";
import {
  getMembershipPlans,
  deleteMembershipPlan,
} from "../../Services/plan";

export default function PlanList() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPage, setTotalPage] = useState(1);

  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  /* =========================================
     FETCH PLANS
  ========================================= */
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getMembershipPlans();
      const data = res.data || [];
      setPlans(data);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* =========================================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ========================================= */
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

  /* =========================================
     SEARCH + PAGINATION
  ========================================= */
  useEffect(() => {
    let filtered = plans;

    if (search.trim()) {
      filtered = plans.filter((plan) =>
        plan.type?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalPage(Math.ceil(filtered.length / limit));

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    setFilteredPlans(paginated);
  }, [plans, search, page]);

  /* =========================================
     DELETE PLAN
  ========================================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await deleteMembershipPlan(id);
      toast.success("Plan deleted successfully");
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  /* =========================================
     DOWNLOAD EXCEL
  ========================================= */
  const handleDownloadExcel = () => {
    if (!plans.length) {
      toast.error("No data available");
      return;
    }

    const formattedData = plans.map((item, index) => ({
      "Sr No": index + 1,
      Type: item.type || "",
      Amount: item.amount || "",
      "Expiry (Days)": item.expiryInDays || "",
      Description: item.description || "",
      "Created At": item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "",
    }));

    exportToExcel(formattedData, "Membership_Plans_List");
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Membership Plans
          </h1>

          <div className="flex gap-3 w-full sm:w-auto">

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by type..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Download Excel */}
            <button
              onClick={handleDownloadExcel}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              Download Excel
            </button>

            {/* Create */}
            <button
              onClick={() => navigate("/home/plan/create")}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
            >
              + Create Plan
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : filteredPlans.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No plans found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-primary-gradient text-white text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-left">Sr No</th>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-left">Type</th>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-left">Amount</th>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-left">Expiry (Days)</th>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-left">Description</th>
                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlans.map((item, index) => {
                    const serialNo = (page - 1) * limit + index + 1;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-indigo-50/20 border-b border-gray-300 border-opacity-50"
                      >
                        <td className="px-6 py-2 text-sm">{serialNo}</td>
                        <td className="px-6 py-2 text-sm font-semibold">
                          {item.type}
                        </td>
                        <td className="px-6 py-2 text-sm">
                          ₹ {item.amount}
                        </td>
                        <td className="px-6 py-2 text-sm">
                          {item.expiryInDays}
                        </td>
                        <td className="px-6 py-2 text-sm truncate max-w-[250px]">
                          {item.description}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-2 text-right">
                          <div
                            ref={(el) =>
                              (menuRefs.current[item._id] = el)
                            }
                            className="inline-block relative"
                          >
                            <button
                              onClick={() => toggleMenu(item._id)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <FiMoreVertical />
                            </button>

                            {openMenuId === item._id && (
                              <ul className="absolute right-0 mt-2 w-40 bg-white  shadow-xl text-sm z-50">
                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(
                                        `/home/plan/view/${item._id}`
                                      );
                                    }}
                                    className="w-full px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-indigo-700"
                                  >
                                    <FiEye size={14} /> View
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      navigate(
                                        `/home/plan/edit/${item._id}`
                                      );
                                    }}
                                    className="w-full px-4 py-2 hover:bg-green-50 flex items-center gap-2 text-green-700"
                                  >
                                    <FiEdit size={14} /> Edit
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleDelete(item._id);
                                    }}
                                    className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                                  >
                                    <FiTrash2 size={14} /> Delete
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
          {!loading && totalPage > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center text-sm">
              <div>
                Page {page} of {totalPage}
              </div>

              <div className="flex gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1 border rounded disabled:opacity-50"
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
