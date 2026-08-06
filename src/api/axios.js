import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint (using plain axios to avoid infinite loops in interceptor)
        const response = await axios.post(`${BASE_URL}/api/v1/admin/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data.data?.accessToken;
        
        if (newAccessToken) {
          localStorage.setItem('token', newAccessToken);
          
          // Update the failed request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry the request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and force logout (can redirect to login or emit event)
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
