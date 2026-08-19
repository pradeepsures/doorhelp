const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getCoupons = async (page = 1, limit = 10, search = "", status = "") => {
  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (search) query.append("search", search);
  if (status) query.append("status", status);

  const res = await fetch(`${BASE_URL}/api/v1/admin/coupons?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const getCouponById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/coupons/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createCoupon = async (data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateCoupon = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/coupons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCoupon = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/coupons/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
