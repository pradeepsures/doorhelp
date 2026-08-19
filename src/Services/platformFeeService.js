const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getPlatformFees = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/platform-fees`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const getPlatformFeeById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/platform-fees/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createPlatformFee = async (data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/platform-fees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePlatformFee = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/platform-fees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePlatformFee = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/platform-fees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
