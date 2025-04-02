import axiosInstance from "@/utils/axiosInstance";

export const getDashboardById = async (id:number) => {
    if (!id) {
      throw new Error("id is required");  
    }
    try {
      const response = await axiosInstance.get(`/dashboard/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };