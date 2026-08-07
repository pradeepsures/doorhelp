const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getSubcategories = async (page = 1, search = "", categoryId = "", status = "", isDeleted = "", limit = 10) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (categoryId) params.categoryId = categoryId;
  if (status !== "") params.status = status;
  if (isDeleted !== "") params.isDeleted = isDeleted;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/v1/admin/subcategory${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to fetch subcategories");
  }
  return result;
};

export const getSubcategoryById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/subcategory/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to fetch subcategory details");
  }
  return result;
};

export const createSubcategory = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/subcategory`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to create subcategory");
  }
  return result;
};

export const updateSubcategory = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/subcategory/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to update subcategory");
  }
  return result;
};

export const deleteSubcategory = async (id) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/subcategory/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to delete subcategory");
  }
  return result;
};
