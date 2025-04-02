import axios from "axios";
import { getTokenFromLocalStorage } from "./localStorageUtils";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3002",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to include the token in request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
