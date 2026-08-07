const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getCategories = async (page = 1, search = "", status = "", isDeleted = "", limit = 10) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status !== "") params.status = status;
  if (isDeleted !== "") params.isDeleted = isDeleted;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/category${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to fetch categories");
  }
  return result;
};

export const getCategoryById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/category/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to fetch category details");
  }
  return result;
};

export const createCategory = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to create category");
  }
  return result;
};

export const updateCategory = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/category/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to update category");
  }
  return result;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to delete category");
  }
  return result;
};
