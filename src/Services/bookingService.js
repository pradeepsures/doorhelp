const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getBookings = async (page = 1, search = "", status = "") => {
  const params = { page, limit: 10 };
  if (search) params.search = search;
  if (status !== "") params.status = status;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/bookings${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || "Failed to fetch bookings");
  }
  return result;
};

export const assignVendor = async (bookingId, vendorId) => {
  const url = `${BASE_URL}/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/assign`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ vendorId }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || "Failed to assign partner");
  }
  return result;
};

export const getBookingById = async (bookingId) => {
  const url = `${BASE_URL}/api/v1/admin/bookings/${encodeURIComponent(bookingId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || "Failed to fetch booking details");
  }
  return result;
};

export const getAvailableVendors = async (bookingId) => {
  const url = `${BASE_URL}/api/v1/admin/bookings/${encodeURIComponent(bookingId)}/available-vendors`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || "Failed to fetch available vendors");
  }
  return result;
};
