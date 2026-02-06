import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getMemberById } from '../../Services/member';

// const FILE_BASE_URL = "https://94np5jjf-7007.inc1.devtunnels.ms";
const FILE_BASE_URL = "http://159.89.146.245:7007"; 


const MemberDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getMemberById(id);
        setMember(data);
      } catch (err) {
        setError(err.message || 'Failed to load member details');
        toast.error(err.message || 'Failed to load member');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error || 'Member not found'}</p>
        <button
          onClick={() => navigate('/home/members/list')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Members List
        </button>
      </div>
    );
  }

  const {
    fullName,
    gender,
    designation,
    countryCode,
    phoneNumber,
    email,
    state,
    preferredLanguage,
    profileImage,
    isActive,
    createdAt,
    organization = {},
  } = member;

  const createdDate = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const incorporationDate = organization.dateOfIncorporation
    ? new Date(organization.dateOfIncorporation).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const getProfileImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/80?text=No+Photo';
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/');
    if (!cleanPath.startsWith('public/')) cleanPath = 'public/' + cleanPath;
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return `${FILE_BASE_URL}${cleanPath}`;
  };

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 text-sm">
      <div className="w-1/3 bg-gray-50 p-3 font-medium text-gray-700 border-r">{label}</div>
      <div className="w-2/3 p-3">{value || '—'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Top Bar - Back + Title + Edit */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            <FaLongArrowAltLeft />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Member Details</h1>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          {/* LEFT COLUMN - Personal Information (including contact) */}
          <div>
            <div className="bg-black text-white p-4 font-semibold text-lg">
              Personal Information
            </div>
            <Row label="Full Name" value={fullName} />
            <Row label="Gender" value={gender} />
            <Row label="Designation" value={designation} />
            <Row label="Phone" value={`${countryCode || ''} ${phoneNumber || '—'}`} />
            <Row label="Email" value={email} />
            <Row label="State" value={state} />
            <Row label="Preferred Language" value={preferredLanguage} />
            <Row label="Member Since" value={createdDate} />
            <Row
              label="Status"
              value={
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              }
            />
          </div>

          {/* RIGHT COLUMN - Organization Information */}
          <div>
            <div className="bg-black text-white p-4 font-semibold text-lg">
              Organization Details
            </div>
            <Row label="Organization Name" value={organization.name} />
            <Row label="Type" value={organization.type} />
            <Row label="Parent Organization" value={organization.parentOrganizationName} />
            <Row label="Nature of Organization" value={organization.natureOfOrganization} />
            <Row label="Incorporated On" value={incorporationDate} />
            <Row label="Postal Address" value={organization.postalAddress} />
            <Row label="PAN Number" value={organization.panNumber} />
            <Row label="GST Number" value={organization.gstNumber} />
            <Row label="Organization Email" value={organization.emailId} />
          </div>
        </div>

        {/* Associations Section */}
        <div className="p-5 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Associations</h3>
          {organization.selectedAssociations?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organization.selectedAssociations.map((assoc) => (
                <span
                  key={assoc._id}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium"
                >
                  {assoc.associationName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No associations assigned</p>
          )}
        </div>

        {/* Profile Photo Section */}
        {profileImage && (
          <div className="p-5 border-t bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>
            <img
              src={getProfileImageUrl(profileImage)}
              alt={fullName || 'Profile'}
              className="w-40 h-40 object-cover rounded-lg border shadow-md"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/160?text=Error')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetailsPage;