import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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