const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// ✅ Get Admin Info
export const getAdminInfo = async () => {
  const url = `${BASE_URL}/api/admin/info`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch admin info: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};

// ✅ Common Update API (dynamic field)
export const updateAdminPolicy = async (id, payload) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/update-info/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // 🔥 dynamic
    }
  );

  if (!res.ok) throw new Error("Failed to update");

  return res.json();
};