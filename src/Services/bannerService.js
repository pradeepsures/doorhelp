const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getBanners = async (page = 1, search = "", status = "", isDeleted = "") => {
  const params = { page, limit: 10 };
  if (search) params.search = search;
  if (status !== "") params.status = status;
  if (isDeleted !== "") params.isDeleted = isDeleted;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/banner${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch banners");
  }
  return result;
};

export const getBannerById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/banner/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch banner details");
  }
  return result;
};

export const createBanner = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/banner`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to create banner");
  }
  return result;
};

export const updateBanner = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/banner/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update banner");
  }
  return result;
};

export const deleteBanner = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/banner/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete banner");
  }
  return result;
};
