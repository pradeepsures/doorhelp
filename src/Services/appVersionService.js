import axiosInstance from "../api/axios";

export const getAppVersions = async () => {
  const response = await axiosInstance.get("/api/v1/admin/app-version");
  return response.data;
};

export const createAppVersion = async (data) => {
  const response = await axiosInstance.post("/api/v1/admin/app-version", data);
  return response.data;
};

export const updateAppVersion = async (id, data) => {
  const response = await axiosInstance.post("/api/v1/admin/app-version", data);
  return response.data;
};
