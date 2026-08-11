import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiUser, FiInfo } from "react-icons/fi";
import { getBookingById } from "../../Services/bookingService";
import { formatDate } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function BookingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getBookingById(id);
        setBooking(res.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600 font-medium">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="p-8 text-center text-red-600 font-medium">
        Booking not found.
        <br />
        <button onClick={() => navigate("/home/booking")} className="mt-4 text-theme font-bold flex items-center gap-2 justify-center mx-auto">
          <FiArrowLeft /> Back to bookings
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
      assigned: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-200 text-red-950",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const googleMapsUrl = booking.location?.lat && booking.location?.long
    ? `https://www.google.com/maps/search/?api=1&query=${booking.location.lat},${booking.location.long}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home/booking")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0D877F] transition font-bold mb-6 text-sm"
        >
          <FiArrowLeft /> Back to Bookings
        </button>

        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Booking Detail: <span className="text-[#0D877F]">{booking.bookingId}</span>
            </h1>
            <p className="text-sm text-gray-500">
              Created on {formatDate(booking.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(booking.bookingStatus)}`}>
              Status: {booking.bookingStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Booking Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Services List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiInfo className="text-[#0D877F]" /> Service Items
              </h2>
              <div className="space-y-4">
                {booking.items.map((item, sIndex) => {
                  const imageSrc = item.subcategoryId?.image
                    ? `${BACKEND_URL}${item.subcategoryId.image}`
                    : "https://via.placeholder.com/80x80?text=Service";
                  return (
                    <div key={sIndex} className="flex gap-4 items-center">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=Service" }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        {item.categoryId?.name && (
                          <span className="inline-block bg-[#0D877F]/10 text-[#0D877F] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                            {item.categoryId.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 block">
                          {item.subcategoryId?.description || "Professional service"}
                        </span>
                        <div className="text-sm text-gray-600 font-medium">
                          Quantity: {item.quantity} x ₹{item.price}
                        </div>
                      </div>
                      <div className="font-bold text-gray-800 text-right">
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address & Navigation Map */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiMapPin className="text-[#0D877F]" /> Service Location
              </h2>
              <p className="text-gray-700 font-semibold mb-2">{booking.address}</p>
              
              {booking.location?.lat && booking.location?.long ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">GPS Coordinates</div>
                      <div className="text-sm font-mono text-gray-700">
                        Latitude: {booking.location.lat}, Longitude: {booking.location.long}
                      </div>
                    </div>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#0D877F] hover:bg-[#0a6660] text-white text-xs font-bold rounded-lg transition shadow-md"
                      >
                        Navigate on Map
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm italic text-gray-400">No GPS coordinates captured for this address.</div>
              )}
            </div>
          </div>

          {/* Right Sidebar Info */}
          <div className="space-y-6">
            {/* Bill Details */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiDollarSign className="text-[#0D877F]" /> Bill Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Service Total</span>
                  <span>₹{booking.serviceTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees (5%)</span>
                  <span>₹{booking.taxAndFees}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Travel Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <hr />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-[#0D877F]">₹{booking.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiUser className="text-[#0D877F]" /> Customer Details
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={booking.userId?.profileImage ? `${BACKEND_URL}${booking.userId.profileImage}` : "https://via.placeholder.com/50x50?text=C"}
                  alt={booking.userId?.name}
                  className="w-12 h-12 object-cover rounded-full border border-gray-200"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/50x50?text=C" }}
                />
                <div>
                  <h4 className="font-bold text-gray-800">{booking.userId?.name || "Guest Customer"}</h4>
                  <span className="text-xs text-gray-500">Customer role</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Phone:</strong> {booking.userId?.phoneNumber || "N/A"}</div>
                <div><strong>Email:</strong> {booking.userId?.email || "N/A"}</div>
              </div>
            </div>

            {/* Assigned Partner */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiCalendar className="text-[#0D877F]" /> Assigned Partner
              </h2>
              {booking.vendorId ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={booking.vendorId.profileImage ? `${BACKEND_URL}${booking.vendorId.profileImage}` : "https://via.placeholder.com/50x50?text=P"}
                      alt={booking.vendorId.name}
                      className="w-12 h-12 object-cover rounded-full border border-gray-200"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/50x50?text=P" }}
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{booking.vendorId.name}</h4>
                      <span className="text-xs text-gray-500">Professional Partner</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Phone:</strong> {booking.vendorId.phoneNumber}</div>
                    <div><strong>Skills:</strong> {booking.vendorId.skills?.join(", ") || "General Services"}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm italic text-gray-400">
                  No professional partner has accepted or been assigned yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
