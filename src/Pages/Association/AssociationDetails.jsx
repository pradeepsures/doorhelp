import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getAssociationDetails } from "../../Services/association";
import {
  updateLeadership,
  deleteLeadership,
} from "../../Services/leadership";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function AssociationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editLeader, setEditLeader] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    profileImg: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAssociationDetails(id);
      if (res.success) {
        setAssociation(res.data);
      }
    } catch (err) {
      toast.error("Failed to load association details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (leaderId) => {
    if (!window.confirm("Are you sure you want to delete this leader?"))
      return;

    try {
      await deleteLeadership(leaderId);
      toast.success("Leadership deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (leader) => {
    setEditLeader(leader);
    setPreviewImage(null);
    setFormData({
      name: leader.name,
      designation: leader.designation,
      profileImg: null,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);

    if (formData.profileImg) {
      data.append("profileImg", formData.profileImg);
    }

    try {
      await updateLeadership(editLeader._id, data);
      toast.success("Leadership updated");
      setEditLeader(null);
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-lg">Loading...</p>;
  }

  if (!association) {
    return <div className="p-6 text-center">Association Not Found</div>;
  }

  const {
    associationName,
    governmentRegistrationNumber,
    yearOfFormation,
    fullAddress,
    city,
    state,
    pinCode,
    presidentOrSecretary,
    countryCode,
    phoneNumber,
    email,
    registrationCertificateType,
    registrationDocument = [],
    profileImage,
    verifiedBy,
    verifiedAt,
    verificationStatus,
    isActive,
    createdAt,
    leaderships = [],
  } = association;

  const Row = ({ label, value, children }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-sm">
      <div className="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r">
        {label}
      </div>
      <div className="w-2/3 px-3 py-2">
        {children || value || "—"}
      </div>
    </div>
  );

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Association Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <FiArrowLeft size={16} /> Back
        </button>
      </div>

      {/* ================= MAIN DETAILS ================= */}
      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">

          <Row label="Profile Image">
            {profileImage && (
              <img
                src={`${FILE_BASE_URL}/${profileImage}`}
                className="w-16 h-16 rounded-full border object-cover"
                alt=""
              />
            )}
          </Row>

          <Row label="Association Name" value={associationName} />
          <Row label="Govt Reg Number" value={governmentRegistrationNumber} />
          <Row label="Year of Formation" value={yearOfFormation} />
          <Row label="Registration Type" value={registrationCertificateType} />
          <Row label="President / Secretary" value={presidentOrSecretary} />
          <Row label="Phone" value={`${countryCode} ${phoneNumber}`} />
          <Row label="Email" value={email} />
          <Row label="Address" value={fullAddress} />
          <Row label="City" value={city} />
          <Row label="State" value={state} />
          <Row label="Pin Code" value={pinCode} />
          <Row label="Verification Status" value={verificationStatus} />
          <Row label="Verified By" value={verifiedBy} />
          <Row
            label="Verified At"
            value={
              verifiedAt
                ? new Date(verifiedAt).toLocaleString()
                : "Not Verified"
            }
          />
          <Row
            label="Created At"
            value={new Date(createdAt).toLocaleString()}
          />

          {registrationDocument.map((doc, i) => (
            <Row key={i} label={`Document ${i + 1}`}>
              <img
                src={`${FILE_BASE_URL}/${doc}`}
                className="w-16 h-16 rounded-full border object-cover"
                alt=""
              />
            </Row>
          ))}
        </div>
      </div>

      {/* ================= LEADERSHIP ================= */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Leadership Members</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaderships.map((leader) => {
            const imgUrl = `${FILE_BASE_URL}/${leader.profileImg}`;

            return (
              <div
                key={leader._id}
                className="bg-white border rounded-lg p-4 text-center relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(leader)}
                    className="text-blue-600"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(leader._id)}
                    className="text-red-600"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <img
                  src={imgUrl}
                  className="w-16 h-16 rounded-full mx-auto object-cover border"
                  alt=""
                />

                <h4 className="mt-2 font-semibold text-sm">
                  {leader.name}
                </h4>

                <p className="text-xs text-indigo-600">
                  {leader.designation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editLeader && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
            <button
              onClick={() => setEditLeader(null)}
              className="absolute top-3 right-3"
            >
              <FiX />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Update Leadership
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="President">President</option>
                  <option value="Vice-President">Vice-President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                </select>
              </div>

              {/* <input
                type="text"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    designation: e.target.value,
                  })
                }
                placeholder="Designation"
                className="w-full border rounded px-3 py-2"
                required
              /> */}

              {/* OLD IMAGE */}
              <div>
                <p className="text-sm mb-1">Current Image</p>
                <img
                  src={`${FILE_BASE_URL}/${editLeader.profileImg}`}
                  className="w-16 h-16 rounded-full border"
                  alt=""
                />
              </div>

              {/* NEW IMAGE */}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, profileImg: file });
                  setPreviewImage(URL.createObjectURL(file));
                }}
              />

              {/* PREVIEW */}
              {previewImage && (
                <div>
                  <p className="text-sm mt-2">New Preview</p>
                  <img
                    src={previewImage}
                    className="w-16 h-16 rounded-full border"
                    alt=""
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Update Leadership
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
