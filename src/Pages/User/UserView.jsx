import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getUserById } from "../../Services/userService";
import { formatDate } from "../../utils/dateFormatter";
import { formatStatus } from "../../utils/stringFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(id);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-600">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home/user")}
          className="flex items-center gap-2 text-[#0D877F] hover:underline mb-6 font-semibold"
        >
          <FiArrowLeft size={18} /> Back to Users List
        </button>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-theme-gradient-horizontal h-24 w-full"></div>

          {/* Profile Header */}
          <div className="px-6 pb-6 relative flex flex-col items-center sm:items-start sm:flex-row gap-6 -mt-10">
            <img
              src={user.profileImage ? `${BASE_URL}${user.profileImage}` : "https://via.placeholder.com/120x120?text=User"}
              alt={user.name || "User"}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md bg-white"
              onError={(e) => { e.target.src = "https://via.placeholder.com/120x120?text=User" }}
            />
            <div className="text-center sm:text-left sm:mt-12 flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || "N/A"}</h2>
              {user.role && (
                <p className="text-sm font-semibold text-[#0D877F] uppercase tracking-wider">
                  {formatStatus(user.role)}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* User Details */}
          {(user.phoneNumber || user.email || user.gender || user.createdAt) && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.phoneNumber && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="text-sm font-medium text-gray-800">{user.phoneNumber}</div>
                </div>
              )}

              {user.email && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="text-sm font-medium text-gray-800">{user.email}</div>
                </div>
              )}

              {user.gender && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                  <div className="text-sm font-medium text-gray-800">{formatStatus(user.gender)}</div>
                </div>
              )}

              {user.createdAt && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Joined Date</label>
                  <div className="text-sm font-medium text-gray-800">{formatDate(user.createdAt)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
