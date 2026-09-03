const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getReferAndEarnList = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/refer-earn`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const getReferAndEarnById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/refer-earn/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createReferAndEarn = async (data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/refer-earn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateReferAndEarn = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/refer-earn/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteReferAndEarn = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/refer-earn/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
