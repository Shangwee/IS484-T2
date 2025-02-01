import { apiClient } from "./api";

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("User profile fetch error:", error);
    return null;
  }
};
