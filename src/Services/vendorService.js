const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getVendors = async (page = 1, search = "", status = "", isVerified = "") => {
  const params = { page, limit: 10 };
  if (search) params.search = search;
  if (status !== "") params.status = status;
  if (isVerified !== "") params.isVerified = isVerified;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/vendor${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch vendors");
  }
  return result;
};

export const getVendorById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/vendor/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch vendor details");
  }
  return result;
};

export const approveVendor = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/vendor/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to approve vendor");
  }
  return result;
};

export const rejectVendor = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/vendor/${id}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to reject vendor");
  }
  return result;
};
