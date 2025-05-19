import { AUTH_ROUTES } from '../routes/auth';
import { 
    LoginRequest, 
    RegisterRequest, 
    ApiResponse, 
    LoginResponse, 
    RegisterResponse 
} from '../types/auth.types';

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';
// const BASE_URL = 'http://3.14.150.170:5000/api';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
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

// Auth Service Functions
export const authService = {
    // Login with email
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return apiCall(AUTH_ROUTES.LOGIN.EMAIL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Register with email
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return apiCall(AUTH_ROUTES.REGISTER.EMAIL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
}; 