const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

/* =========================================
   GET EVENT LIST (Pagination + Search by Title)
========================================= */
export const getEventList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const url = `${BASE_URL}/api/admin/event${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch event list");
  }

  return result;
};

/* =========================================
   GET EVENT BY ID
========================================= */
export const getEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/event/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch event details");
  }

  return result;
};

/* =========================================
   CREATE EVENT
========================================= */
export const createEvent = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/event`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData, // ⚠️ DO NOT set Content-Type
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to create event");
  }

  return result;
};

/* =========================================
   UPDATE EVENT
========================================= */
export const updateEvent = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/event/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update event");
  }

  return result;
};

/* =========================================
   DELETE FULL EVENT
========================================= */
export const deleteEvent = async (id) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/event/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete event");
  }

  return result;
};

/* =========================================
   DELETE EVENT IMAGE BY INDEX
   (index sent in req.body)
========================================= */
export const deleteEventImageByIndex = async (id, index) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/event/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ index }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete image");
  }

  return result;
};