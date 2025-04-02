// src/utils/localStorageUtils.ts

const createAuthLocalStorage = (user: object) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userAuth", JSON.stringify(user)); // Save the user object as a string
    }
  };
  
  const getAuthFromLocalStorage = (): object | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userAuth");
      return user ? JSON.parse(user) : null; // Parse the JSON string back into an object
    }
    return null;
  };
  
  const clearAuthLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userAuth"); // Clear the user data
    }
  };
  
const createTokenLocalStorage = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", JSON.stringify(token)); // Save the user object as a string
    }
  };
  
  const getTokenFromLocalStorage = (): object | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("token");
      return user ? JSON.parse(user) : null; // Parse the JSON string back into an object
    }
    return null;
  };
  
  const clearTokenLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // Clear the user data
    }
  };
  
  export { createAuthLocalStorage, getAuthFromLocalStorage, clearAuthLocalStorage, createTokenLocalStorage, getTokenFromLocalStorage, clearTokenLocalStorage };
  