const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");


// Get Dashboard Stats
export const getDashboardStats = async () => {
  const url = `${BASE_URL}/api/admin/dashboard-stats`;

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
      `Failed to fetch dashboard stats: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};