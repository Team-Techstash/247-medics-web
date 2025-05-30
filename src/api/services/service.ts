import { AUTH_ROUTES, APPOINTMENTS_ROUTES, REFERENCE_ROUTES } from '../routes/api';
import { API_CONFIG } from '@/config/api';
import {
    LoginRequest,
    ApiResponse,
    LoginResponse,
    RegisterResponse
} from '../types/auth.types';

// Base API URL
const API_BASE_URL = API_CONFIG.BASE_URL;

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}/${endpoint}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            // Prefer error.message, then error.error, then fallback
            const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

export const authService = {
    // Login with email
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return apiCall(AUTH_ROUTES.LOGIN.EMAIL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    forgotPassword: async (data: any): Promise<any> => {
        return apiCall(AUTH_ROUTES.FORGOT_PASSWORD, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    resetPassword: async (token: any, data: any): Promise<any> => {
        return apiCall(AUTH_ROUTES.RESET_PASSWORD(token), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Register with email
    register: async (data: any): Promise<RegisterResponse> => {
        return apiCall(AUTH_ROUTES.REGISTER.EMAIL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Register with Google
    googleSignUp: async (data: { googleAuthToken: string; role: string }): Promise<RegisterResponse> => {
        return apiCall(AUTH_ROUTES.REGISTER.GOOGLE, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const appointmentsService = {
    create: async (data: any): Promise<any> => {
        return apiCall(APPOINTMENTS_ROUTES.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAppointments: async (status?: string, sort?: string): Promise<any> => {
        let url = APPOINTMENTS_ROUTES.GET_APPOINTMENTS;
        const queryParams = new URLSearchParams();
        
        if (status) queryParams.append('status', status);
        if (sort) queryParams.append('sort', sort);
        
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        return apiCall(url, {
            method: 'GET',
        });
    },

    getAppointmentById: async (id: string): Promise<any> => {
        return apiCall(APPOINTMENTS_ROUTES.GET_APPOINTMENT_BY_ID(id), {
            method: 'GET',
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
            method: 'GET',
        });
    },

};