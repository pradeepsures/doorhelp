const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// LIST with filters
export const getIndustryNewsList = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const query = new URLSearchParams({
    page,
    limit,
    search,
  }).toString();

  const res = await fetch(
    `${BASE_URL}/api/admin/industry-news?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch industry news");

  return res.json();
};

// GET BY ID
export const getIndustryNewsById = async (id) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/industry-news/${id}`,
    {
       method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch industry news");

  return res.json();
};

// DELETE
export const deleteIndustryNews = async (id) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/industry-news/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to delete");

  return res.json();
};

