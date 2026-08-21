const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getCmsContent = async (type, pageName) => {
  const res = await fetch(`${BASE_URL}/api/v1/common/cms/${type}/${pageName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch cms content");
  }
  return result;
};

export const getPublicCmsContent = async (type, pageName) => {
  const res = await fetch(`${BASE_URL}/api/v1/common/cms/${type}/${pageName}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch cms content");
  }
  return result;
};

export const updateCmsContent = async (type, pageName, content) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/cms/${type}/${pageName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ content }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update cms content");
  }
  return result;
};
