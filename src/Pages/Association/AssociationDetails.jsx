import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getAssociationDetails } from "../../Services/association";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function AssociationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAssociationDetails(id);
        if (res.success) {
          setAssociation(res.data);
        } else {
          throw new Error("Failed to load details");
        }
      } catch (err) {
        toast.error("Failed to load association details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-center text-lg">Loading...</p>;
  }

  if (!association) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Association Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </div>
    );
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
  } = association;

  const Row = ({ label, value, children }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px] items-center min-h-[40px]">
      <div className="w-1/3 md:w-1/3 bg-gray-100 p-3 font-medium text-gray-800 border-r">
        {label}
      </div>
      <div className="w-2/3 md:w-2/3 p-3 flex items-center gap-3">
        {children || (value || "—")}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Association Details</h3>

      {/* Back + Edit Buttons */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
        >
          <FiArrowLeft size={18} /> Back
        </button>

        {/* Uncomment when ready */}
        {/* <button
          onClick={() => navigate(`/home/association/edit/${id}`)}
          className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm transition"
        >
          Edit
        </button> */}
      </div>

      {/* Main Details Grid */}
      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Profile Image */}
          <Row label="Profile Image">
            {profileImage ? (
              <div className="flex items-center gap-4">
                <img
                  src={`${FILE_BASE_URL}/${profileImage}`}
                  alt="Profile"
                  className="w-16 h-16 object-cover rounded-full border border-gray-300 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                  onClick={() => window.open(`${FILE_BASE_URL}/${profileImage}`, "_blank", "noopener,noreferrer")}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")}
                />
                {/* <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `${FILE_BASE_URL}/${profileImage}`;
                    link.download = profileImage.split("/").pop() || "profile.jpg";
                    link.click();
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Download Profile Image"
                >
                  <FaDownload size={16} />
                </button> */}
              </div>
            ) : (
              <span className="text-gray-500 italic">Not Uploaded</span>
            )}
          </Row>

          <Row label="Association Name" value={associationName || "N/A"} />
          <Row label="Govt. Reg. Number" value={governmentRegistrationNumber || "N/A"} />
          <Row label="Year of Formation" value={yearOfFormation || "N/A"} />
          <Row label="Registration Type" value={registrationCertificateType || "N/A"} />
          <Row label="President / Secretary" value={presidentOrSecretary || "N/A"} />
          <Row label="Phone" value={`${countryCode || ""} ${phoneNumber || "N/A"}`} />
          <Row label="Email" value={email || "N/A"} />
          <Row label="Full Address" value={fullAddress || "N/A"} />
          <Row label="City" value={city || "N/A"} />
          <Row label="State" value={state || "N/A"} />
          <Row label="Pin Code" value={pinCode || "N/A"} />
          <Row
            label="Status"
            value={
              <span className={`font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>
                {isActive ? "Active" : "Inactive"}
              </span>
            }
          />
          <Row
            label="Verification Status"
            value={
              <span className={`font-medium ${verificationStatus === "Verified" ? "text-green-600" : "text-orange-600"}`}>
                {verificationStatus || "Pending"}
              </span>
            }
          />
          <Row label="Verified By" value={verifiedBy || "Not Verified"} />
          <Row
            label="Verified At"
            value={
              verifiedAt
                ? new Date(verifiedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Not Verified"
            }
          />
          <Row
            label="Created At"
            value={new Date(createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />

          {/* Registration Documents – Each in its own Row */}
          {registrationDocument.length > 0 ? (
            registrationDocument.map((doc, index) => {
              const normalizedPath = doc.replace(/\\/g, "/");
              const fullUrl = `${FILE_BASE_URL}/${normalizedPath}`;
              const fileName = normalizedPath.split("/").pop() || `document-${index + 1}`;
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

              return (
                <Row key={index} label={`Registration Document ${index + 1}`}>
                  <div className="flex items-center gap-4">
                    {isImage ? (
                      <img
                        src={fullUrl}
                        alt={`Document ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border border-gray-300 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                        onClick={() => window.open(fullUrl, "_blank", "noopener,noreferrer")}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=Error")}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                        File
                      </div>
                    )}

                    {/* <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" title={fileName}>
                        {fileName}
                      </div>
                    </div> */}
{/* 
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = fullUrl;
                        link.download = fileName;
                        link.click();
                      }}
                      className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                      title="Download document"
                    >
                      <FaDownload size={14} />
                      <span className="text-xs">Download</span>
                    </button> */}
                  </div>
                </Row>
              );
            })
          ) : (
            <Row label="Registration Documents">
              <span className="text-gray-500 italic">No documents uploaded</span>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}