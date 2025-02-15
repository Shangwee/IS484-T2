import axios from "axios";

const API_BASE_URL = "https://backend-v1.greenbay-df0bd36f.southeastasia.azurecontainerapps.io";

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

export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
};