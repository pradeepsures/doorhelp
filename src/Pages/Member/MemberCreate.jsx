import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMember, getAllAssociations } from '../../Services/member';

const CreateMember = () => {
  const navigate = useNavigate();

  const initialFormData = {
    fullName: '',
    gender: 'Male',
    designation: '',
    countryCode: '+91',
    phoneNumber: '',
    email: '',
    state: '',
    preferredLanguage: 'English',
    isActive: true,
    organizationType: 'Company',
    organizationName: '',
    parentOrganizationName: '',
    postalAddress: '',
    dateOfIncorporation: '',
    organizationEmailId: '',
    natureOfOrganization: '',
    panNumber: '',
    gstNumber: '',
    selectedAssociations: [], // array of association IDs
  };

  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAssociationsOpen, setIsAssociationsOpen] = useState(false);
  const associationsRef = useRef(null);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const res = await getAllAssociations();
        if (res.success && Array.isArray(res.data)) {
          setAssociations(res.data);
        }
      } catch (err) {
        setFormError('Failed to load associations. Please try again.');
        console.error(err);
      }
    };
    fetchAssociations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (associationsRef.current && !associationsRef.current.contains(event.target)) {
        setIsAssociationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'isActive') {
      setFormData((prev) => ({ ...prev, isActive: checked }));
      return;
    }

    // All other fields (including flattened organization ones)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleAssociation = (assocId) => {
    setFormData((prev) => {
      const current = prev.selectedAssociations || [];
      const updated = current.includes(assocId)
        ? current.filter((id) => id !== assocId)
        : [...current, assocId];

      return { ...prev, selectedAssociations: updated };
    });
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setProfileImage(null);
    setImagePreview(null);
    setSearchTerm('');
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      console.log("Selected associations:", formData.selectedAssociations);

      const response = await createMember({
        ...formData,
        profileImage,
      });

      if (response?.success) {
        setSuccessMessage('Member created successfully!');
        setTimeout(() => navigate('/home/members/list'), 1800);
      } else {
        setFormError(response?.message || 'Failed to create member');
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred');
      console.error('Create member error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssociations = associations.filter((assoc) =>
    assoc.associationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAssocNames = formData.selectedAssociations
    .map((id) => associations.find((a) => a._id === id)?.associationName)
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create New Member</h1>
      </div>

      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - General Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            General Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
            <input
              type="text"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Organization Information (flattened) */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Organization Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              type="text"
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Organization</label>
            <input
              type="text"
              name="parentOrganizationName"
              value={formData.parentOrganizationName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalAddress"
              value={formData.postalAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incorporation</label>
            <input
              type="date"
              name="dateOfIncorporation"
              value={formData.dateOfIncorporation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="organizationEmailId"
              value={formData.organizationEmailId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Organization</label>
            <input
              type="text"
              name="natureOfOrganization"
              value={formData.natureOfOrganization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Associations Dropdown */}
          <div className="relative" ref={associationsRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Associations <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem]">
              {selectedAssocNames.map((name, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => {
                      const assoc = associations.find((a) => a.associationName === name);
                      if (assoc) toggleAssociation(assoc._id);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsAssociationsOpen(true);
              }}
              onFocus={() => setIsAssociationsOpen(true)}
              placeholder="Search associations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />

            {isAssociationsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {filteredAssociations.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">No associations found</div>
                ) : (
                  filteredAssociations.map((assoc) => (
                    <div
                      key={assoc._id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${
                        formData.selectedAssociations.includes(assoc._id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => toggleAssociation(assoc._id)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAssociations.includes(assoc._id)}
                        readOnly
                        className="h-5 w-5 text-blue-600 rounded pointer-events-none"
                      />
                      <div className="font-medium text-gray-800">{assoc.associationName}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
          <button
            type="button"
            onClick={clearForm}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium w-full sm:w-auto"
          >
            Clear Form
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/home/members/list')}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium order-2 sm:order-1"
            >
              ← Back to List
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-3 text-lg font-medium rounded-lg shadow-md transition-all order-1 sm:order-2 w-full sm:w-auto ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Creating...' : 'Create Member'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMember;