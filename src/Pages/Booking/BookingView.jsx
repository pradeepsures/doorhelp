import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiUser, FiInfo } from "react-icons/fi";
import { getBookingById, assignVendor, getAvailableVendors } from "../../Services/bookingService";
import { getVendors } from "../../Services/vendorService";
import { formatDate } from "../../utils/dateFormatter";
import { formatStatus } from "../../utils/stringFormatter";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default function BookingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for partner assignment
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);

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

  useEffect(() => {
    if (!id) return;
    const fetchAvailableVendors = async () => {
      try {
        const res = await getAvailableVendors(id);
        setVendors(res.data || []);
      } catch (error) {
        console.error("Error fetching available vendors:", error);
      }
    };
    fetchAvailableVendors();
  }, [id]);

  const handleAssignPartner = async (e) => {
    e.preventDefault();
    if (!selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }

    if (booking && booking.paymentStatus !== "paid") {
      toast.error("Booking payment is not paid");
      return;
    }

    try {
      setSubmittingAssign(true);
      await assignVendor(booking.bookingId, selectedVendorId);
      toast.success("Vendor assigned successfully");
      
      // Refresh booking details
      const res = await getBookingById(id);
      setBooking(res.data);
      setIsReassigning(false);
      setSelectedVendorId("");
    } catch (error) {
      console.error("Error assigning vendor:", error);
      toast.error(error.message || "Failed to assign vendor");
    } finally {
      setSubmittingAssign(false);
    }
  };

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
      active: "bg-orange-100 text-orange-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const userLat = booking.location?.lat || booking.userAddressId?.lat || booking.userAddressId?.location?.lat;
  const userLong = booking.location?.long || booking.userAddressId?.long || booking.userAddressId?.location?.long;

  const googleMapsUrl = userLat && userLong
    ? `https://www.google.com/maps/search/?api=1&query=${userLat},${userLong}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 w-full">
      <div className="w-full">
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
            {booking.createdAt && (
              <p className="text-sm text-gray-500">
                Created on {formatDate(booking.createdAt)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(booking.bookingStatus)}`}>
              Status: {formatStatus(booking.bookingStatus)}
            </span>
            {booking.paymentStatus && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Payment: {formatStatus(booking.paymentStatus)}
              </span>
            )}
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Booking Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Booking Info & Status */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FiInfo className="text-[#0D877F]" /> Booking Info & Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Booking ID</div>
                  <div className="text-sm font-semibold text-gray-800">{booking.bookingId}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Scheduled Date</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Time Slot</div>
                  <div className="text-sm font-semibold text-gray-800">{booking.timeSlot || 'N/A'} (Type: {booking.slotType || 'N/A'})</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Trip Status / Booking Status</div>
                  <div className="text-sm font-semibold text-gray-800 capitalize">{formatStatus(booking.bookingStatus)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Payment Mode</div>
                  <div className="text-sm font-semibold text-gray-800 uppercase">{booking.paymentMode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Payment Status</div>
                  <div className="text-sm font-semibold text-gray-800 capitalize">{formatStatus(booking.paymentStatus)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Start OTP</div>
                  <div className="text-sm font-mono font-bold text-gray-800">{booking.startOtp || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">OTP Verification Status</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {booking.isOtpVerified ? (
                      <span className="text-green-600 font-bold">Verified</span>
                    ) : (
                      <span className="text-yellow-600 font-bold">Not Verified</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Created At</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Last Updated</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            {booking.items && booking.items.length > 0 && (
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
                          {item.subcategoryId?.description && (
                            <span className="text-xs text-gray-500 block">
                              {item.subcategoryId.description}
                            </span>
                          )}
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
            )}

            {/* Address & Navigation Map */}
            {booking.address && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <FiMapPin className="text-[#0D877F]" /> Service Location
                </h2>
                {typeof booking.address === "string" ? (
                  <p className="text-gray-700 font-semibold mb-2">{booking.address}</p>
                ) : (
                  <div className="text-gray-700 space-y-1">
                    {booking.address.name && (
                      <p className="font-bold text-gray-800">Contact Person: {booking.address.name}</p>
                    )}
                    {booking.address.mobile && (
                      <p className="text-sm font-medium text-gray-600">Mobile: {booking.address.mobile}</p>
                    )}
                    <p className="font-semibold mt-1">
                      {[
                        booking.address.houseFlat,
                        booking.address.locality,
                        booking.address.landmark ? `Near ${booking.address.landmark}` : null,
                        booking.address.city,
                        booking.address.state,
                        booking.address.pin ? `PIN: ${booking.address.pin}` : null,
                        booking.address.country
                      ].filter(Boolean).join(", ") || booking.address.address}
                    </p>
                  </div>
                )}
                
                {userLat && userLong && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">GPS Coordinates</div>
                        <div className="text-sm font-mono text-gray-700">
                          Latitude: {userLat}, Longitude: {userLong}
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
                )}
              </div>
            )}

            {/* Service Verification Photos */}
            {((booking.beforeWorkImage && booking.beforeWorkImage.length > 0) || 
              (booking.afterWorkImage && booking.afterWorkImage.length > 0)) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <FiInfo className="text-[#0D877F]" /> Service Verification Photos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Work Section */}
                  {booking.beforeWorkImage && booking.beforeWorkImage.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Before Work Photos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {booking.beforeWorkImage.map((img, index) => {
                          const imageUrl = `${BACKEND_URL}${img}`;
                          return (
                            <div key={index} className="relative group border rounded-lg overflow-hidden">
                              <img src={imageUrl} alt={`Before work ${index + 1}`} className="w-full h-32 object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-2 bg-white text-gray-800 rounded hover:bg-gray-100 text-[10px] font-bold">View</a>
                                <a href={imageUrl} download={`before-work-${booking.bookingId}-${index + 1}`} className="p-1 px-2 bg-[#0D877F] text-white rounded hover:bg-[#0a6660] text-[10px] font-bold">Download</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* After Work Section */}
                  {booking.afterWorkImage && booking.afterWorkImage.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">After Work Photos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {booking.afterWorkImage.map((img, index) => {
                          const imageUrl = `${BACKEND_URL}${img}`;
                          return (
                            <div key={index} className="relative group border rounded-lg overflow-hidden">
                              <img src={imageUrl} alt={`After work ${index + 1}`} className="w-full h-32 object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-2 bg-white text-gray-800 rounded hover:bg-gray-100 text-[10px] font-bold">View</a>
                                <a href={imageUrl} download={`after-work-${booking.bookingId}-${index + 1}`} className="p-1 px-2 bg-[#0D877F] text-white rounded hover:bg-[#0a6660] text-[10px] font-bold">Download</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Info */}
          <div className="space-y-6">
            {/* Bill Details */}
            {(booking.serviceTotal !== undefined || booking.taxAndFees !== undefined || booking.grandTotal !== undefined) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <FiDollarSign className="text-[#0D877F]" /> Bill Details
                </h2>
                <div className="space-y-3 text-sm">
                  {booking.serviceTotal !== undefined && (
                    <div className="flex justify-between text-gray-600">
                      <span>Service Total</span>
                      <span>₹{booking.serviceTotal}</span>
                    </div>
                  )}
                  {booking.taxAndFees !== undefined && (
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes & Fees (5%)</span>
                      <span>₹{booking.taxAndFees}</span>
                    </div>
                  )}
                  {booking.serviceTotal !== undefined && (
                    <div className="flex justify-between text-gray-600">
                      <span>Travel Fee</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  )}
                  <hr />
                  {booking.grandTotal !== undefined && (
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-[#0D877F]">₹{booking.grandTotal}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Details */}
            {booking.userId && (booking.userId.name || booking.userId.phoneNumber || booking.userId.email) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <FiUser className="text-[#0D877F]" /> Customer Details
                </h2>
                {booking.userId.name && (
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={booking.userId.profileImage ? `${BACKEND_URL}${booking.userId.profileImage}` : "https://via.placeholder.com/50x50?text=C"}
                      alt={booking.userId.name}
                      className="w-12 h-12 object-cover rounded-full border border-gray-200"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/50x50?text=C" }}
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{booking.userId.name}</h4>
                      <span className="text-xs text-gray-500">Customer</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2 text-sm text-gray-600">
                  {booking.userId.phoneNumber && (
                    <div><strong>Phone:</strong> {booking.userId.phoneNumber}</div>
                  )}
                  {booking.userId.email && (
                    <div><strong>Email:</strong> {booking.userId.email}</div>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Partner */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiCalendar className="text-[#0D877F]" /> Assigned Partner
                </h2>
                {booking.vendorId && !isReassigning && (booking.bookingStatus === 'scheduled' || booking.bookingStatus === 'pending' || booking.bookingStatus === 'declined' || booking.bookingStatus === 'assigned') && (
                  <button
                    onClick={() => setIsReassigning(true)}
                    className="text-xs text-[#0D877F] hover:underline font-bold"
                  >
                    Change Partner
                  </button>
                )}
              </div>

              {booking.vendorId && !isReassigning ? (
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
                    {booking.vendorId.phoneNumber && (
                      <div><strong>Phone:</strong> {booking.vendorId.phoneNumber}</div>
                    )}
                    {booking.vendorId.skills && booking.vendorId.skills.length > 0 && (
                      <div><strong>Skills:</strong> {booking.vendorId.skills.join(", ")}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {isReassigning && booking.vendorId && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">Current Partner: <strong>{booking.vendorId.name}</strong></span>
                      <button
                        type="button"
                        onClick={() => setIsReassigning(false)}
                        className="text-xs text-rose-500 hover:underline font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleAssignPartner} className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-600">
                      Select Partner
                    </label>
                    <select
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D877F] focus:outline-none text-sm bg-white"
                      required
                    >
                      <option value="">-- Select Active Vendor --</option>
                      {(() => {
                        const bookingCategoryIds = booking
                          ? booking.items.map(item => (item.categoryId?._id || item.categoryId || "").toString()).filter(Boolean)
                          : [];
                        
                        const filteredVendors = vendors.filter((v) => {
                          // 1. Must be active and online
                          const isOnline = v.onlineStatus === 'online';
                          const isActive = v.status === 'active';
                          if (!isActive || !isOnline) return false;

                          // 2. Must belong to the booking category
                          const vendorCategoryIds = v.categories ? v.categories.map(cat => (cat._id || cat).toString()) : [];
                          return vendorCategoryIds.some(catId => bookingCategoryIds.includes(catId));
                        });

                        if (filteredVendors.length === 0) {
                          return <option disabled value="">No active partners found for this category</option>;
                        }

                        return filteredVendors.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name} ({v.phoneNumber}) - {v.skills?.join(", ") || "No specific skill"}
                          </option>
                        ));
                      })()}
                    </select>
                    <button
                      type="submit"
                      disabled={submittingAssign}
                      className="w-full py-2 bg-[#0D877F] hover:bg-[#0a6660] text-white rounded-lg text-xs font-bold transition shadow-md disabled:opacity-50"
                    >
                      {submittingAssign ? "Assigning..." : "Assign Vendor"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
