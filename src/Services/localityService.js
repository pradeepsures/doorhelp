const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getLocalities = async (page = 1, limit = 10, search = "", status = "") => {
  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (search) query.append("search", search);
  if (status) query.append("status", status);

  const res = await fetch(`${BASE_URL}/api/v1/admin/localities?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const getLocalityById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/localities/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createLocality = async (data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/localities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateLocality = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/localities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteLocality = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/localities/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
