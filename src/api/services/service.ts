import {
  AUTH_ROUTES,
  APPOINTMENTS_ROUTES,
  REFERENCE_ROUTES,
  DOCTOR_ROUTES,
  REVIEWS_ROUTES,
  COUNTRY_ROUTES,
} from "../routes/api";
import { API_CONFIG } from "@/config/api";
import {
  LoginRequest,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from "../types/auth.types";

// Base API URL
const API_BASE_URL = API_CONFIG.BASE_URL;

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  jwtToken?: String
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    // for handling route based authenticated request like password reset or stripe onboarding for doctor
    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Prefer error.message, then error.error, then fallback
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

export const authService = {
  // Login with email
  login: async (data: LoginRequest): Promise<any> => {
    return apiCall(AUTH_ROUTES.LOGIN.EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: any): Promise<any> => {
    return apiCall(AUTH_ROUTES.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (token: any, data: any): Promise<any> => {
    return apiCall(AUTH_ROUTES.RESET_PASSWORD(token), {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Register with email
  register: async (data: any): Promise<any> => {
    return apiCall(AUTH_ROUTES.REGISTER.EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Register with Google
  googleSignUp: async (data: {
    googleAuthToken: string;
    role: string;
  }): Promise<RegisterResponse> => {
    return apiCall(AUTH_ROUTES.REGISTER.GOOGLE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update user profile
  updateProfile: async (data: Partial<User>, userId: string): Promise<any> => {
    return apiCall(AUTH_ROUTES.PROFILE.UPDATE(userId), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  getProfile: async (): Promise<any> => {
    return apiCall(AUTH_ROUTES.PROFILE.GET_USER, {
      method: "GET",
    });
  },
  refreshToken: async (): Promise<any> => {
    return apiCall(AUTH_ROUTES.PROFILE.REFRESH_TOKEN, {
      method: "POST",
    });
  },
};

export const appointmentsService = {
  create: async (data: any): Promise<any> => {
    return apiCall(APPOINTMENTS_ROUTES.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAppointments: async (status?: string, sort?: string): Promise<any> => {
    let url = APPOINTMENTS_ROUTES.GET_APPOINTMENTS;
    const queryParams = new URLSearchParams();

    if (status) queryParams.append("status", status);
    if (sort) queryParams.append("sort", sort);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return apiCall(url, {
      method: "GET",
    });
  },

  getAppointmentById: async (id: string): Promise<any> => {
    return apiCall(APPOINTMENTS_ROUTES.GET_APPOINTMENT_BY_ID(id), {
      method: "GET",
    });
  },

  getDoctorResponse: async (appointmentId: string): Promise<any> => {
    return apiCall(APPOINTMENTS_ROUTES.GET_DOCTOR_RESPONSES(appointmentId), {
      method: "GET",
    });
  },

  //    getById: async (id: string): Promise<any> => {
  //     const token = localStorage.getItem("authToken");
  //     const endpoint = `${APPOINTMENTS_ROUTES.GET_APPOINTMENT_BY_ID}${id}`;
  //     return apiCall(endpoint, {
  //         method: 'GET',
  //         headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //         },
  //     });
  // },
};

export const referenceService = {
  getReferences: async (): Promise<any> => {
    return apiCall(REFERENCE_ROUTES.GET_REFERENCES, {
      method: "GET",
    });
  },
};
export const doctorService = {
  checkStripeAccountStatus: async (
    data: any,
    jwtToken?: String
  ): Promise<any> => {
    return apiCall(
      DOCTOR_ROUTES.CHECK_STRIPE_ONBOARDING,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      jwtToken
    );
  },
  getStripeSetupLink: async (jwtToken?: String): Promise<any> => {
    return apiCall(
      DOCTOR_ROUTES.ONBOARDING_SETUP,
      {
        method: "GET",
      },
      jwtToken
    );
  },
};

export const reviewsService = {
  create: async (data: { rating: number; comment: string; appointmentId: string }): Promise<any> => {
    return apiCall(REVIEWS_ROUTES.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const countryService = {
  getCountries: async (): Promise<any> => {
    return apiCall(COUNTRY_ROUTES.GET_COUNTRIES, {
      method: "GET",
    });
  },
  getCities: async ( q: string = "te",countryCode: string): Promise<any> => {
    return apiCall(COUNTRY_ROUTES.GET_CITIES(q, countryCode), {
      method: "GET",
    });
  },
};
