const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const createLeadership = async (data) => {
  const res = await fetch(`${BASE_URL}/api/admin/leaderships`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to create leadership");
  }

  return res.json();
};



// Get All Leaderships
export const getLeaderships = async ({
  page = 1,
  limit = 10,
  search = "",
  association,
}) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/leaderships?page=${page}&limit=${limit}&association=${association}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch leaderships");
  }

  return res.json();
};

// Update Leadership
export const updateLeadership = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/admin/leaderships/${id}`, {
    method: "PATCH", 
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: data, // formData
  });

  if (!res.ok) {
    throw new Error("Failed to update leadership");
  }

  return res.json();
};


// Delete Leadership
export const deleteLeadership = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/leaderships/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete leadership");
  }

  return res.json();
};