import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Adjust if you use a different toast library

const AppVersion = () => {
  const [versions, setVersions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    latestVersion: '',
    minimumRequiredVersion: '',
    isUpdateMandatory: false,
    storeUrl: '',
    updateMessage: ''
  });

  const baseUrl = 'http://localhost:5000/api/v1/admin/app-version'; // Update with your actual API base URL or env variable

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth
      const response = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVersions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching app versions:', error);
      toast.error('Failed to load app versions');
    }
  };

  const handleEdit = (version) => {
    setEditingId(version._id);
    setFormData({
      appName: version.appName,
      latestVersion: version.latestVersion,
      minimumRequiredVersion: version.minimumRequiredVersion,
      isUpdateMandatory: version.isUpdateMandatory,
      storeUrl: version.storeUrl,
      updateMessage: version.updateMessage
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(baseUrl, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('App version updated successfully');
        setEditingId(null);
        fetchVersions();
      }
    } catch (error) {
      console.error('Error updating app version:', error);
      toast.error('Failed to update app version');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // If table is empty, allow creating the first records
  const handleCreateDefault = async (appType) => {
      setEditingId('new');
      setFormData({
          appName: appType,
          latestVersion: '1.0.0',
          minimumRequiredVersion: '1.0.0',
          isUpdateMandatory: false,
          storeUrl: '',
          updateMessage: 'Please update your app.'
      });
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">App Versions Settings</h2>
      
      {editingId ? (
        <div className="bg-white p-6 rounded shadow-md w-1/2">
          <h3 className="text-xl mb-4">Update Version for {formData.appName}</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block mb-1">Latest Version</label>
              <input type="text" name="latestVersion" value={formData.latestVersion} onChange={handleChange} className="border p-2 w-full" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Minimum Required Version</label>
              <input type="text" name="minimumRequiredVersion" value={formData.minimumRequiredVersion} onChange={handleChange} className="border p-2 w-full" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Store URL</label>
              <input type="text" name="storeUrl" value={formData.storeUrl} onChange={handleChange} className="border p-2 w-full" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Update Message</label>
              <textarea name="updateMessage" value={formData.updateMessage} onChange={handleChange} className="border p-2 w-full" rows="3"></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <input type="checkbox" name="isUpdateMandatory" checked={formData.isUpdateMandatory} onChange={handleChange} className="mr-2" id="mandatoryCheck" />
              <label htmlFor="mandatoryCheck">Is Update Mandatory?</label>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
              <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {versions.length === 0 && (
              <div className="mb-4 space-x-2">
                  <button onClick={() => handleCreateDefault('user_app')} className="bg-green-500 text-white px-4 py-2 rounded">Initialize User App Record</button>
                  <button onClick={() => handleCreateDefault('vendor_app')} className="bg-green-500 text-white px-4 py-2 rounded">Initialize Vendor App Record</button>
              </div>
          )}
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">App Name</th>
                <th className="p-3 text-left">Latest Version</th>
                <th className="p-3 text-left">Min Required Version</th>
                <th className="p-3 text-left">Mandatory?</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((ver) => (
                <tr key={ver._id} className="border-b">
                  <td className="p-3 font-semibold">{ver.appName}</td>
                  <td className="p-3">{ver.latestVersion}</td>
                  <td className="p-3">{ver.minimumRequiredVersion}</td>
                  <td className="p-3">{ver.isUpdateMandatory ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(ver)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppVersion;
