const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getPincodes = async (page = 1, limit = 10, search = "", status = "") => {
  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (search) query.append("search", search);
  if (status) query.append("status", status);

  const res = await fetch(`${BASE_URL}/api/v1/admin/pincodes?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const getPincodeById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/pincodes/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createPincode = async (data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/pincodes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePincode = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/pincodes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePincode = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/pincodes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
