import { AddClient, AddIncomeExpense, AddInvoice } from "@/helpers/types";
import axiosInstance from "@/utils/axiosInstance";


export const getIncomeExpense = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
    try {
      const response = await axiosInstance.get(`/invoicePayments/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

export const getIncomeExpenseById = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
    try {
      const response = await axiosInstance.get(`/invoicePayments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

  export const getIncomeExpenseByInvId = async (id:number) => {
  if (!id) {
    throw new Error("id is required");  
  }
    try {
      const response = await axiosInstance.get(`/invoicePayments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  
  export const postIncomeExpense = async (data) => {
      
    try {
      const response = await axiosInstance.post(`/invoicePayments/`,data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  
  export const putInvoice = async (data:AddInvoice, id:number) => {
    if (!id) {
      throw new Error("id is required");  
    }
    try {
      const response = await axiosInstance.put(`/invoicePayments/${id}`,data);
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
  