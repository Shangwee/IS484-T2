import axios from "axios";

const API_URL = "https://backend-v1-bxgyfnaubsfgg3f4.southeastasia-01.azurewebsites.net";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");
