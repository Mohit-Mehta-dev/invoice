import { AddClient, AddInvoice } from "@/helpers/types";
import axiosInstance from "@/utils/axiosInstance";


export const getInvoices = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
    try {
      const response = await axiosInstance.get(`/invoices/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

export const getInvoiceById = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
    try {
      const response = await axiosInstance.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  
  export const postInvoice = async (data) => {
      
    try {
      const response = await axiosInstance.post(`/invoices/`,data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  
  export const putInvoice = async (data, id:number) => {
    if (!id) {
      throw new Error("id is required");  
    }
    try {
      const response = await axiosInstance.put(`/invoices/${id}`,data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  
  export const deleteInvoice = async (id:number) => {
    if (!id) {
      throw new Error("id is required");  
    }
    try {
      const response = await axiosInstance.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  