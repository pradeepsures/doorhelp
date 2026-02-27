import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { getMembershipAssignmentById } from "../../Services/assignedPlanToAssociation";

const MembershipAssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await getMembershipAssignmentById(id);
      setData(res.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
if (loading) {
  return (
    <div className="p-10 text-center">
      Loading...
    </div>
  );
}

  if (!data) {
    return (
      <div className="text-center py-10 text-red-500">
        No membership data found.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Membership Details</h1>
      </div>

      {/* Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <DetailItem label="Association Name" value={data.association?.associationName} />
            <DetailItem label="Registration No." value={data.association?.governmentRegistrationNumber} />
            <DetailItem label="Year Of Formation" value={data.association?.yearOfFormation} />
            <DetailItem label="City" value={data.association?.city} />
            <DetailItem label="State" value={data.association?.state} />
            <DetailItem label="President / Secretary" value={data.association?.presidentOrSecretary} />
            <DetailItem label="Phone Number" value={`${data.association?.countryCode} ${data.association?.phoneNumber}`} />
            <DetailItem label="Email" value={data.association?.email} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <DetailItem label="Membership Type" value={data.membershipPlan?.type} />
            <DetailItem label="Amount" value={`₹ ${data.membershipPlan?.amount}`} />
            <DetailItem label="Expiry (Days)" value={data.membershipPlan?.expiryInDays} />
            <DetailItem label="Payment Status" value={data.paymentStatus} />
            <DetailItem label="Verification Status" value={data.association?.verificationStatus} />
            <DetailItem label="Is Active" value={data.association?.isActive ? "Yes" : "No"} />
            <DetailItem
              label="Assigned By"
              value={data.assignedBy?.email}
            />
            <DetailItem
              label="Created At"
              value={new Date(data.createdAt).toLocaleString()}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MembershipAssignmentDetails;


/* =========================================
   Reusable Detail Item Component
========================================= */

const DetailItem = ({ label, value }) => {
  return (
    <div className="flex justify-between pb-3 border-b border-gray-200/100">
      <span className="font-semibold text-gray-700">
        {label}
      </span>
      <span className="text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
};

