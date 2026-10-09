import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { getAppVersions } from "../../Services/appVersionService";
import Loader from "../../compoents/Loader";

const AppVersionList = () => {
  const [appVersions, setAppVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const res = await getAppVersions();
      if (res.success) {
        // Handle if response is an array or a single object
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setAppVersions(data.filter(Boolean));
      } else {
        toast.error(res.message || "Failed to fetch app versions");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch app versions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 h-full font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D877F]">App Versions</h1>
        {appVersions.length === 0 && (
          <Link
            to="/home/app-version/create"
            className="bg-[#0D877F] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
          >
            Create App Version
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#0D877F] to-teal-600 text-white">
                <th className="p-4 font-semibold">User App Version</th>
                <th className="p-4 font-semibold">Vendor App Version</th>
                <th className="p-4 font-semibold">Mandatory Update</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appVersions.length > 0 ? (
                appVersions.map((version, index) => (
                  <tr
                    key={version._id || index}
                    className={`border-b border-gray-100 hover:bg-teal-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {version.userAppVersion || "-"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {version.vendorAppVersion || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          version.isUpdateMandatory
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {version.isUpdateMandatory ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`/home/app-version/edit/${version._id || "edit"}`}
                        state={{ versionData: version }}
                        className="text-blue-500 hover:text-blue-700 inline-block p-2"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No App Versions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppVersionList;
