// src/services/clientService.ts
import { AddClient } from "@/helpers/types";
import axiosInstance from "../utils/axiosInstance";

export const getClients = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
  try {
    const response = await axiosInstance.get(`/customers/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

export const getClientById = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
  try {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

export const postClients = async (data:AddClient) => {
    
  try {
    const response = await axiosInstance.post(`/customers/`,data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

export const putClients = async (data:AddClient,id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
  try {
    const response = await axiosInstance.put(`/customers/${id}`,data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

export const deleteClients = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
  try {
    const response = await axiosInstance.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};
