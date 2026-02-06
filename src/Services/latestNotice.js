const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

//create latest  notice
export const createLatestNotice = async (data) => {
  const res = await fetch(`${BASE_URL}/api/admin/latest-notices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: data, // FormData (image + pdf)
  });

  if (!res.ok) throw new Error("Failed to create notice");
  return res.json();
};


//get all notices list
export const getLatestNoticesList = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const query = new URLSearchParams({ page, limit, search }).toString();
  const res = await fetch(`${BASE_URL}/api/admin/latest-notices?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch latest notices");
  return res.json();
};

//get notices details
export const getLatestNoticeDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/latest-notices/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notice details");
  return res.json();
};

//update latest notice
export const updateLatestNotice = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/admin/latest-notices/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: data, 
  });

  if (!res.ok) throw new Error("Failed to update notice");
  return res.json();
};


//delte notice
export const deleteLatestNotice = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/latest-notices/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete notice");
  return res.json();
};