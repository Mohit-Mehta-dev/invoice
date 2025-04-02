// src/services/authService.ts
import { RegisterFormType } from "@/helpers/types";
import axiosInstance from "../utils/axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/users/login", {
      email,
      password,
    });
    return response.data; // Returns the user data or token from the response
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Handle the error appropriately in your component
  }
};

export const register = async (data:RegisterFormType) => {
  try {
    const response = await axiosInstance.post("/users/register", data);
    return response.data; // Returns the user data or token from the response
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Handle the error appropriately in your component
  }
};

export const getSettings = async (id: number) => {
  if (!id) {
    throw new Error("id is required");  
  }
  try {
    const response = await axiosInstance.get(`/settings/${id}`);
    return response.data; // Returns the user data or token from the response
  } catch (error) {
    console.error("error fetching settings:", error);
    throw error; // Handle the error appropriately in your component
  }
};

export const updateProfile = async (data,id: number) => {
  try {
    const response = await axiosInstance.put(`/users/profile/${id}`, data);
    return response.data; // Returns the user data or token from the response
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Handle the error appropriately in your component
  }
};

export const getProfile = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/users/profile/${id}`);
    return response.data; // Returns the user data or token from the response
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Handle the error appropriately in your component
  }
};

export const getImage = async (url: string) => {
  try {
    const response = await axiosInstance.get(`${url}`);
    return response; // Returns the user data or token from the response
  } catch (error) {
    console.error("Image fetching failed:", error);
    throw error; // Handle the error appropriately in your component
  }
};