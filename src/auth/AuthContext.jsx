// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
  });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     if (!auth.token) {
  //       setAuth((prev) => ({ ...prev, user: null }));
  //       localStorage.removeItem("user");
  //       setLoading(false);
  //       return;
  //     }

  //     // If we already have user data and token, no need to fetch again
  //     if (auth.user && auth.token) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const res = await axios.get(`${BASE_URL}/api/admin/profile`, {
  //         headers: { Authorization: `Bearer ${auth.token}` },
  //       });
  //       if (res.data.status) {
  //         const userData = res.data.data.user;
  //         localStorage.setItem("user", JSON.stringify(userData));
  //         setAuth((prev) => ({ ...prev, user: userData }));
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user profile", error);
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");
  //       setAuth({ token: null, user: null });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserProfile();
  // }, [auth.token, auth.user]);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/login-admin`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        setAuth({ token, user: user || null }); // profile loads in useEffect if not provided
        return { success: true };
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };
  const hasPermission = (sectionName, action) => {
    if (!auth.user?.role?.permission) return false;
    const section = auth.user.role.permission.find(
      (p) => p.sectionName.toLowerCase() === sectionName.toLowerCase()
    );
    if (!section) return false;
    const key = "is" + action.charAt(0).toUpperCase() + action.slice(1);
    return !!section[key];
  };
  return (
    <AuthContext.Provider
      value={{ auth, login, logout, hasPermission, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
