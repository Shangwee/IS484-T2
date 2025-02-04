import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getData = async (endpoint) => {
  try {
    const response = await apiClient.get(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
};
