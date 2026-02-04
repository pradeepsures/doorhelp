/**
 * ViewUserLog.jsx
 * Enhanced user log view
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getUserLogByIdApi } from "../../Services/UserApi";
import HistoryIcon from "@mui/icons-material/History";

export default function ViewUserLog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getUserLogByIdApi(id);
      if (result?.status) {
        toast.success(result.message || "User log fetched successfully!");
        setData(result.data); // ✅ result.data is an ARRAY
      } else {
        toast.error(result?.message || "Failed to fetch user log.");
      }
    } catch (error) {
      toast.error("Error fetching user log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <p className="text-center text-red-600 text-xl font-semibold">
          No data available
        </p>
      </div>
    );
  }

  // Small Card Component for Changes
  const ChangeRow = ({ field, oldValue, newValue }) => {
    const isImageField = field === "profileImage";

    const getImage = (path) => {
      if (!path) return "/defaultUser.jpg";
      return path.startsWith("public") ? path.replace(/^public/, "") : path;
    };

    const formatValue = (val) => {
      if (val === undefined || val === null) return "N/A";
      if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "None";
      return String(val);
    };

    return (
      <div className="bg-gray-50 rounded p-1 text-xs">
        <div className="mb-1">
          <h4 className="text-xs font-medium text-gray-600 capitalize truncate">
            {field}
          </h4>
        </div>

        {isImageField ? (
          <div className="space-y-1">
            <div className="flex justify-center">
              <img
                src={getImage(oldValue)}
                alt="Old"
                className="w-6 h-6 object-cover rounded"
              />
            </div>
            <div className="text-center text-xs text-gray-400">↓</div>
            <div className="flex justify-center">
              <img
                src={getImage(newValue)}
                alt="New"
                className="w-6 h-6 object-cover rounded"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="px-1 py-0.5 rounded text-xs">
              <div className="text-gray-500 text-xs">Old:</div>
              <div className="text-gray-700 truncate">
                {formatValue(oldValue)}
              </div>
            </div>
            <div className="px-1 py-0.5 rounded text-xs">
              <div className="text-gray-500 text-xs">New:</div>
              <div className="text-gray-700 truncate">
                {formatValue(newValue)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Breaker />

      <div className="max-w-5xl mx-auto mt-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Change History
              </h1>
              <p className="text-gray-600 mt-1">
                View all modifications made to user data
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Log Cards */}
        <div className="space-y-4">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((log, index) => (
              <div
                key={log?._id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                {/* Log Header */}
                <div className="flex justify-between items-start mb-4 pb-3 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      User:{" "}
                      <span className="font-medium">{log?.user?.name}</span>
                      {/* ({log?.user?.email}) */}
                    </p>
                    <p className="text-sm text-gray-600">
                      Updated by:{" "}
                      <span className="font-medium">
                        {log?.updatedBy?.name}
                      </span>
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white border px-3 py-1 rounded-full">
                    {log?.updatedAt
                      ? new Date(log.updatedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                {/* Changes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.isArray(log?.changes) && log.changes.length > 0 ? (
                    log.changes.map((change) => (
                      <ChangeRow
                        key={change?._id}
                        field={change?.field}
                        oldValue={change?.oldValue}
                        newValue={change?.newValue}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">
                        No changes recorded for this log
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500 text-lg">No logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
