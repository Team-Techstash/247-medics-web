import { CHAT_ROUTES } from "../routes/api";
import { API_CONFIG } from "@/config/api";

// Base API URL
const API_BASE_URL = API_CONFIG.BASE_URL;

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  jwtToken?: String
): Promise<any> {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.message || data.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

export const chatService = {
  // Get messages by chat ID
  getMessages: async (chatId: string, limit: number = 30, page: number = 1): Promise<any> => {
    return apiCall(CHAT_ROUTES.GET_MESSAGES(chatId, limit, page), {
      method: "GET",
    });
  },

  // Get or create chat session by appointment ID
  getChatSession: async (appointmentId: string): Promise<any> => {
    return apiCall(CHAT_ROUTES.GET_CHAT_SESSION, {
      method: "POST",
      body: JSON.stringify({ appointmentId }),
    });
  },
}; 