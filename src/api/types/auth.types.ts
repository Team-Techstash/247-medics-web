// Address type

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

// Register form errors
export interface RegisterFormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    gender: string,
    age: string,
}

// Login form data
export interface LoginRequest {
    email: string;
    password: string;
}

// Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// User Types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    // Add other user properties as needed
}

// Auth Response Types
export interface LoginResponse extends ApiResponse {
    data?: {
        token: string;
        user: User;
    };
}

export interface RegisterResponse extends ApiResponse {
    data?: {
        token: string;
        user: User;
    };
} 