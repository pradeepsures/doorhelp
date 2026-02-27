import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiEye, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  getMembershipAssignments,
  deleteMembershipAssignment,
  createMembershipAssignment,
  getMembershipAssignmentById,
  updateMembershipAssignment
} from "../../Services/assignedPlanToAssociation";

import { getAssociationList } from "../../Services/association";
import { getMembershipPlans } from "../../Services/plan";

import { exportToExcel } from "../../utils/exportToexcel";


export default function MembershipAssignmentsList() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("associationName");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  const [associations, setAssociations] = useState([]);
  const [plans, setPlans] = useState([]);

  const [assignmentData, setAssignmentData] = useState({
    association: "",
    membershipPlan: "",
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    association: "",
    membershipPlan: "",
  });

  const limit = 10;
  const menuRefs = useRef({});

  /* ================= FETCH DATA ================= */
  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      if (search.trim()) {
        params[searchField] = search.trim(); V
      }

      const res = await getMembershipAssignments(params);

      setAssignments(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [page, search, searchField]);

  //associations
  const fetchAssociations = async (search = "") => {
    try {
      const res = await getAssociationList({ search });
      setAssociations(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch associations");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await getMembershipPlans();
      setPlans(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch plans");
    }
  };

  const openModal = () => {
    setOpenAssignModal(true);
    fetchAssociations();
    fetchPlans();
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    if (!assignmentData.association || !assignmentData.membershipPlan) {
      toast.error("Please select both association and plan");
      return;
    }

    try {
      await createMembershipAssignment(assignmentData);
      toast.success("Plan assigned successfully");
      setOpenAssignModal(false);
      fetchAssignments(); // refresh table
    }
     catch (err) {
      toast.error(err.message || "Assignment failed");
    }
  };

  //edit funtion
  const openEditModalHandler = async (id) => {
    try {
      setEditId(id);
      setOpenEditModal(true);

      await fetchAssociations();
      await fetchPlans();

      const res = await getMembershipAssignmentById(id);
      const data = res.data;

      setEditData({
        association: data.association?._id || "",
        membershipPlan: data.membershipPlan?._id || "",
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        association: String(editData.association),
        membershipPlan: String(editData.membershipPlan),
      };

      await updateMembershipAssignment(editId, payload);
       toast.success("Plan update successfully");

      setOpenEditModal(false);
      setEditId(null);
      fetchAssignments();

    } catch (err) {
      console.error(err);
    }
  };



  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteMembershipAssignment(id);
      toast.success("Deleted successfully");
      fetchAssignments();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  /* ================= EXCEL DOWNLOAD ================= */
  const handleDownloadExcel = async () => {
    try {
      const res = await getMembershipAssignments({ page: 1, limit: 10000 });
      const fullData = res.data || [];

      if (!fullData.length) {
        toast.error("No data available");
        return;
      }

      const formatted = fullData.map((item, index) => ({
        "Sr No": index + 1,
        "Plan Type": item.membershipPlan?.type || "",
        Amount: item.membershipPlan?.amount || "",
        "Expiry (Days)": item.membershipPlan?.expiryInDays || "",
        "Association Name": item.association?.associationName || "",
        Phone: item.association?.phoneNumber || "",
        Email: item.association?.email || "",
        City: item.association?.city || "",
        Address: item.association?.fullAddress || "",
        "Payment Status": item.paymentStatus || "",
        "Assigned Date": new Date(item.createdAt).toLocaleDateString(),
      }));

      exportToExcel(formatted, "Membership_Assignments_List");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Membership Assignments
          </h1>

          <div className="flex gap-3 flex-wrap">

            {/* Search Field Select */}
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="associationName">Association Name</option>
              <option value="planType">Plan Type</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Download Excel
            </button>

            {/* Create Button */}
            <button
              onClick={openModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              + Assign Plan
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : assignments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No assignments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className=" text-white">
                  <tr>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">Sr No</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">ASSOCIATION DETAILS</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">PLAN</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">PRICE</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">DURATION</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">CITY</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">ADDRESS</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-left">PAYMENT</th>
                    <th className="px-4 py-3 bg-primary-gradient text-white text-sm text-right">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((item, index) => {
                    const serialNo = (page - 1) * limit + index + 1;

                    return (
                      <tr key={item._id} className="border-b border-gray-300 border-opacity-50 hover:bg-gray-50">
                        <td className="px-4 py-3">{serialNo}</td>

                        {/* Association */}
                        <td className="px-4 py-3">
                          <p className="font-medium">
                            {item.association?.associationName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.association?.phoneNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.association?.email}
                          </p>
                        </td>

                        {/* Plan */}
                        <td className="px-4 py-3">
                          <p className="font-semibold">
                            {item.membershipPlan?.type}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          ₹ {item.membershipPlan?.amount}
                        </td>

                        <td className="px-4 py-3">
                          {item.membershipPlan?.expiryInDays} Days
                        </td>

                        <td className="px-4 py-3">
                          {item.association?.city}
                        </td>

                        <td className="px-4 py-3 max-w-[250px] truncate">
                          {item.association?.fullAddress}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${item.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {item.paymentStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div
                            ref={(el) => (menuRefs.current[item._id] = el)}
                            className="relative inline-block"
                          >
                            <button
                              onClick={() => toggleMenu(item._id)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <FiMoreVertical />
                            </button>

                            {openMenuId === item._id && (
                              <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg z-50">
                                <li>
                                  <button
                                    onClick={() =>
                                      navigate(`/home/assignedPlan/view/${item._id}`)
                                    }
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex gap-2"
                                  >
                                    <FiEye /> View
                                  </button>
                                </li>
                                <li>
                                  {/* <button
                                    onClick={() =>
                                      navigate(`/home/membership-assignments/edit/${item._id}`)
                                      
                                    }
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex gap-2"
                                  >
                                    <FiEdit /> Edit
                                  </button> */}
                                  <button
                                    onClick={() => openEditModalHandler(item._id)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex gap-2"
                                  >
                                    <FiEdit /> Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex gap-2"
                                  >
                                    <FiTrash2 /> Delete
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

          {openAssignModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-lg">
                <button
                  onClick={() => setOpenAssignModal(false)}
                  className="absolute top-3 right-3 text-gray-500"
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">Assign Plan to Association</h3>

                <form onSubmit={handleAssignPlan} className="space-y-4">

                  {/* Association Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Association
                    </label>
                    <select
                      name="association"
                      value={assignmentData.association}
                      onChange={handleAssignmentChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- Select Association --</option>
                      {associations.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.associationName} ({a.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Membership Plan
                    </label>
                    <select
                      name="membershipPlan"
                      value={assignmentData.membershipPlan}
                      onChange={handleAssignmentChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- Select Plan --</option>
                      {plans.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.type} (₹{p.amount} / {p.expiryInDays} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  >
                    Assign Plan
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* update model */}
          {openEditModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-lg">

                <button
                  onClick={() => {
                    setOpenEditModal(false);
                    setEditId(null);
                  }}
                  className="absolute top-3 right-3 text-gray-500"
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">
                  Update Assigned Plan
                </h3>

                <form onSubmit={handleUpdateAssignment} className="space-y-4">

                  {/* Association Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Association
                    </label>
                    <select
                      name="association"
                      value={editData.association}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- Select Association --</option>
                      {associations.map((a) => (
                        <option key={a._id} value={String(a._id)}>
                          {a.associationName} ({a.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Membership Plan
                    </label>
                    <select
                      name="membershipPlan"
                      value={editData.membershipPlan}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- Select Plan --</option>
                      {plans.map((p) => (
                        <option key={p._id} value={String(p._id)}>
                          {p.type} (₹{p.amount} / {p.expiryInDays} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  >
                    Update Plan
                  </button>
                </form>
              </div>
            </div>
          )}


          {/* Pagination */}
          {totalPage > 1 && (
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPage}
              </span>

              <button
                disabled={page === totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
