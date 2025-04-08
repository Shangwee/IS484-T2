import axios from "axios";

// Toggle between local and production endpoints
const isLocalDevelopment = true; // Set to false for production

const API_BASE_URL = isLocalDevelopment 
  ? "http://localhost:5001" 
  : "https://backend-v1-bxgyfnaubsfgg3f4.southeastasia-01.azurewebsites.net";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Add a timeout for better error handling
  timeout: 15000,
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

export const postDataBlob = async (endpoint, data) => {
  try {
    const response = await apiClient.post(`${endpoint}`, data, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
};

// Special function for RAG queries with better error handling
export const queryRAG = async (query, options = {}) => {
  try {
    const { clientProfile, entityFocus, timeRange } = options;
    
    // Add loading and timeout tracking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await apiClient.post('/rag/query', {
      query,
      clientProfile,
      entityFocus,
      timeRange
    }, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Request timed out. The server took too long to respond.',
        errorType: 'timeout'
      };
    } else if (error.response) {
      // Server responded with an error status
      return {
        success: false,
        error: error.response.data.message || 'Server error occurred',
        errorType: 'server',
        status: error.response.status
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        error: 'No response from server. Please check your connection.',
        errorType: 'network'
      };
    } else {
      // Other errors
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        errorType: 'unknown'
      };
    }
  }
};

// Add interceptors for handling auth tokens (if needed in the future)
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);