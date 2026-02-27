const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

/* =========================================
   GET ALL PLANS
========================================= */
export const getMembershipPlans = async () => {
  const url = `${BASE_URL}/api/admin/membership-plans`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch plans: ${res.status} - ${errorText}`);
  }

  return res.json();
};


/* =========================================
   CREATE PLAN
========================================= */
export const createMembershipPlan = async (data) => {
  const url = `${BASE_URL}/api/admin/membership-plans`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create plan: ${res.status} - ${errorText}`);
  }

  return res.json();
};


/* =========================================
   GET PLAN BY ID
========================================= */
export const getMembershipPlanById = async (id) => {
  const url = `${BASE_URL}/api/admin/membership-plans/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch plan: ${res.status} - ${errorText}`);
  }

  return res.json();
};


/* =========================================
   UPDATE PLAN
========================================= */
export const updateMembershipPlan = async (id, data) => {
  const url = `${BASE_URL}/api/admin/membership-plans/${id}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update plan: ${res.status} - ${errorText}`);
  }

  return res.json();
};


/* =========================================
   DELETE PLAN BY ID
========================================= */
export const deleteMembershipPlan = async (id) => {
  const url = `${BASE_URL}/api/admin/membership-plans/${id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete plan: ${res.status} - ${errorText}`);
  }

  return res.json();
};
