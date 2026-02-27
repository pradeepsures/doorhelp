const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// ✅ Get Gallery List (with pagination)
export const getGalleryList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/admin/gallery${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch gallery list");
  }

  return res.json();
};

// Create Gallery
export const createGallery = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/gallery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData, // Important: FormData (do NOT set Content-Type)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create gallery");
  }

  return res.json();
};

// ✅ Get Gallery By ID
export const getGalleryById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/gallery/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch gallery details");

  return res.json();
};

// ✅ Update Gallery (PATCH)
export const updateGallery = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/admin/gallery/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: data, // FormData if images included
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update gallery");
  }

  return res.json();
};

// ✅ Delete Gallery
export const deleteGallery = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/gallery/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete gallery");
  }

  return res.json();
};


//delete gallery
export const deleteGalleryImage = async (id, index) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/gallery/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ index }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete image");
  }

  return res.json();
};