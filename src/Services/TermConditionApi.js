const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from 'react-hot-toast';

export const getAllTermCondition = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
  try {
    console.log(searchQuery, 'searchQuery');
    const res = await fetch(
      `${BASE_URL}/api/admin/termCondition?page=${page}&limit=${rowsPerPage}${searchQuery ? `&search=${searchQuery}` : ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const result = await res.json();
    // if (!res.ok || !result.status) {
    //   throw new Error(result.message || 'Failed to fetch roles');
    // }
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};
  export const createTermCondition = async (data) => {
    const token = localStorage.getItem('token');
    console.log(data, ' data for send in the api');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/termCondition`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Required for JSON data
        },
        body: JSON.stringify(data), // Convert JS object to JSON string
      });
  
      const result = await res.json();
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };
  
  // Or use a secure auth provider
  
  export const updateTermCondition  = async ( id, dataToSend ) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/termCondition/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // token must be defined
        },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Update failed');
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      console.error(err.message || 'Something went wrong!');
      throw err;
    }
  };
  
  
  
export const getTermConditionById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/termCondition/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};


export const TermConditionDelete = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/termCondition/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message || 'Something went wrong!');
  }
};