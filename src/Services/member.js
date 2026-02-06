const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get member listing 
export const getMembersList = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/api/admin/members${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch members: ${res.status} - ${errorText}`);
  }

  return res.json();
};

//getmember detials
export const getMemberById = async (memberId) => {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${BASE_URL}/api/admin/members/${memberId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch member (${response.status})`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API returned unsuccessful response');
    }

    return result.data; // return the actual member object
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error; // let the component handle the error
  }
};

// create member
export const createMember = async (memberData) => {
  const formData = new FormData();

  // ── Personal / Member fields ───────────────────────────────────────
  formData.append('fullName',          memberData.fullName          || '');
  formData.append('gender',            memberData.gender            || '');
  formData.append('designation',       memberData.designation       || '');
  formData.append('countryCode',       memberData.countryCode       || '');
  formData.append('phoneNumber',       memberData.phoneNumber       || '');
  formData.append('email',             memberData.email             || '');
  formData.append('state',             memberData.state             || '');
  formData.append('preferredLanguage', memberData.preferredLanguage || '');
  formData.append('isActive',          memberData.isActive ? 'true' : 'false');

  // ── Organization fields (flattened) ────────────────────────────────
  formData.append('organizationType',                  memberData.organizationType           || '');
  formData.append('organizationName',                  memberData.organizationName           || '');
  formData.append('parentOrganizationName',memberData.parentOrganizationName     || '');
  formData.append('postalAddress',         memberData.postalAddress  || '');

  // Date – only append if valid
  if (memberData.dateOfIncorporation) {
    try {
      const isoDate = new Date(memberData.dateOfIncorporation).toISOString();
      formData.append('dateOfIncorporation', isoDate);
    } catch (e) {
      console.warn('Invalid incorporation date – skipping', e);
    }
  }

  formData.append('organizationEmailId',            memberData.organizationEmailId  || '');
  formData.append('natureOfOrganization', memberData.natureOfOrganization || '');
  formData.append('panNumber',          memberData.panNumber    || '');
  formData.append('gstNumber',          memberData.gstNumber    || '');

  // ── Associations (repeated key = array) ────────────────────────────
  (memberData.selectedAssociations || []).forEach((id) => {
    formData.append('selectedAssociations', id);
  });

  // ── Profile image (optional) ───────────────────────────────────────
  if (memberData.profileImage instanceof File) {
    formData.append('profileImage', memberData.profileImage);
  }

  // ── Debug: inspect what is actually being sent ─────────────────────
  console.log("FormData being sent:");
  for (let [key, value] of formData.entries()) {
    const display = value instanceof File ? `[File: ${value.name}]` : value;
    console.log(`  ${key}: ${display}`);
  }

  const res = await fetch(`${BASE_URL}/api/admin/create-member`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    throw new Error(`Server error - ${res.status} ${res.statusText} → ${text}`);
  }

  if (!res.ok) {
    throw new Error(data?.message || `Failed to create member (${res.status})`);
  }

  return data;
};

// Services/member.js
export const updateMember = async (memberId, data) => {
  try {
    const formData = new FormData();

    // Append all text fields
    for (const key in data) {
      if (key !== 'profileImage' && data[key] !== undefined && data[key] !== null) {
        if (key === 'selectedAssociations') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    // Append file if new image is selected
    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }

    const res = await fetch(`${BASE_URL}/api/admin/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to update member');
    }

    return result;
  } catch (error) {
    console.error('Update member error:', error);
    throw error;
  }
};

// delete member
export const deleteMember = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/members/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete member");
  return res.json();
};

//all associations
export const getAllAssociations = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/all-associations`, {
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
