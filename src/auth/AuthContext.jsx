// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
  });
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    try {
      // Use the custom axiosInstance for consistency, though plain axios could work here since we don't have a token yet
      const response = await axiosInstance.post(`/api/v1/admin/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      const { accessToken, refreshToken, admin } = response.data?.data || {};

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (admin) {
          localStorage.setItem("user", JSON.stringify(admin));
        }
        setAuth({ token: accessToken, user: admin || null });
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
    localStorage.removeItem("refreshToken");
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
