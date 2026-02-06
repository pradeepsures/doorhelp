const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get all association list
// src/Services/association.js  (or wherever it lives)

export const getAssociationList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/admin/associations${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch associations: ${res.status} - ${errorText}`);
  }

  return res.json();
};

//create association
export const createAssociation = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/create-association`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData, // FormData object (text + files)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create association");
  }

  return res.json();
};

//get association details
export const getAssociationDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/associations/${id}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
  });
    if (!res.ok) throw new Error("Failed to fetch association details");
    return res.json();
};

//update association
export const updateAssociation = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/admin/associations/${id}`, {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
    body: data, 
  });
    if (!res.ok) throw new Error("Failed to update association");
    return res.json();
};

//delete association
export const deleteAssociation = async (id) => {    
    const res = await fetch(`${BASE_URL}/api/admin/associations/${id}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
  });
    if (!res.ok) throw new Error("Failed to delete association");
    return res.json();
};  

// In services/api.js  ← keep this function as is
export const updateAssociationStatus = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/admin/associations/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",   
    },
    body: JSON.stringify(data),            
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update association");
  }

  return res.json();
};

//delete association document
export const deleteAssociationDocument = async (id, index) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/associations/delete-document/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ index })
    }
  );

  return res.json();
};

