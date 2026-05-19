import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor – attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor – handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data on unauthorized
      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  },
);

export default apiClient;