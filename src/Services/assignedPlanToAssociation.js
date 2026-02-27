const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

/* =========================================
   GET ALL ASSIGNMENTS
========================================= */
export const getMembershipAssignments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/admin/membership-assignments?${query}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch membership assignments: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};

// export const getMembershipAssignments = async () => {
//   const url = `${BASE_URL}/api/admin/membership-assignments`;

//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(
//       `Failed to fetch membership assignments: ${res.status} - ${errorText}`
//     );
//   }

//   return res.json();
// };


/* =========================================
   CREATE MEMBERSHIP ASSIGNMENT
========================================= */
export const createMembershipAssignment = async (data) => {
  const url = `${BASE_URL}/api/admin/membership-assignments`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json(); // ✅ Parse JSON

  if (!res.ok) {
    // ✅ Extract correct backend message
    throw new Error(
      result?.error?.message || result?.message || "Assignment failed"
    );
  }

  return result;
};
// export const createMembershipAssignment = async (data) => {
//   const url = `${BASE_URL}/api/admin/membership-assignments`;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(
//       `Failed to create membership assignment: ${res.status} - ${errorText}`
//     );
//   }

//   return res.json();
// };

/* =========================================
   GET ASSIGNMENT BY ID
========================================= */
export const getMembershipAssignmentById = async (id) => {
  const url = `${BASE_URL}/api/admin/membership-assignments/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch membership assignment: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};


/* =========================================
   UPDATE ASSIGNMENT
========================================= */
export const updateMembershipAssignment = async (id, data) => {
  const url = `${BASE_URL}/api/admin/membership-assignments/${id}`;

  const res = await fetch(url, {
    method: "PATCH", // change to PUT if your backend uses PUT
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to update membership assignment: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};


/* =========================================
   DELETE ASSIGNMENT
========================================= */
export const deleteMembershipAssignment = async (id) => {
  const url = `${BASE_URL}/api/admin/membership-assignments/${id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to delete membership assignment: ${res.status} - ${errorText}`
    );
  }

  return res.json();
};
