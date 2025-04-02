import { AddSettings } from "@/helpers/types";
import axiosInstance from "@/utils/axiosInstance";

export const postSettings = async (id: number,data) => {
  if (!id) {
    throw new Error("id is required");  
  }
      
    try {
      const response = await axiosInstance.put(`/settings/${id}`,data,{headers:{'Content-Type':'multipart/form-data'}});
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

  export const createSettings = async (data:AddSettings) => {
    try {
      const response = await axiosInstance.post(`/settings/`,data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };