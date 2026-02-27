// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const getToken = () => localStorage.getItem("token");

// /* =========================================
//    GET banner LIST 
// ========================================= */
// export const getBannerList = async (params = {}) => {
//   const url = `${BASE_URL}/api/admin/banner`;

//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to fetch banner list");
//   }

//   return result;
// };

// /* =========================================
//    GET BANNER BY ID
// ========================================= */
// export const getBannerById = async (id) => {
//   const res = await fetch(`${BASE_URL}/api/admin/banner/${id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to fetch banner details");
//   }

//   return result;
// };

// /* =========================================
//    CREATE BANNER
// ========================================= */
// export const createBanner = async (formData) => {
//   const res = await fetch(`${BASE_URL}/api/admin/banner`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: formData, // ⚠️ DO NOT set Content-Type
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to create banner");
//   }

//   return result;
// };

// /* =========================================
//    UPDATE BANNER
// ========================================= */
// export const updateBanner = async (id, formData) => {
//   const res = await fetch(`${BASE_URL}/api/admin/banner`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: formData,
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to update banner");
//   }

//   return result;
// };

// /* =========================================
//    DELETE FULL BANNER
// ========================================= */
// export const deleteBanner = async (id) => {
//   const res = await fetch(
//     `${BASE_URL}/api/admin/banner/delete/${id}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to delete banner");
//   }

//   return result;
// };

// /* =========================================
//    DELETE BANNER IMAGE BY INDEX
//    (index sent in req.body)
// ========================================= */
// export const deleteBannerImageByIndex = async (id, index) => {
//   const res = await fetch(
//     `${BASE_URL}/api/admin/banner/${id}`,
//     {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify({ index }),
//     }
//   );

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result?.message || "Failed to delete image");
//   }

//   return result;
// };


const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

/* =========================================
   GET BANNER
========================================= */
export const getBannerList = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/banner`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch banner");
  }

  return result;
};

/* =========================================
   UPDATE BANNER (UPLOAD MORE IMAGES)
========================================= */
export const updateBanner = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/banner`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData, // ⚠️ don't set content-type
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update banner");
  }

  return result;
};

/* =========================================
   DELETE IMAGE BY INDEX
========================================= */
export const deleteBannerImageByIndex = async (id, index) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/banner`,
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