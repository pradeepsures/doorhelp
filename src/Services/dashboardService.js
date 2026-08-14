const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getDashboardStats = async () => {
  const url = `${BASE_URL}/api/v1/admin/dashboard/stats`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch dashboard statistics");
  }
  return result;
};
