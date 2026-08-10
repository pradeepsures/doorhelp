const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getUsers = async (page = 1, search = "", status = "", isDeleted = "") => {
  const params = { page, limit: 10 };
  if (search) params.search = search;
  if (status !== "") params.status = status;
  if (isDeleted !== "") params.isDeleted = isDeleted;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/user${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch users");
  }
  return result;
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch user details");
  }
  return result;
};
