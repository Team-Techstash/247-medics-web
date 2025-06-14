// Address type
export interface Address {
    streetAddress1: string;
    city: string;
}

interface EmergencyContact {
    email: string;
    relation: string;
    fullName: string;
    phone: string;
}

interface RegulatoryDetails {
    authorityName: string;
    registrationNumber: string;
    onSpecialistRegister: boolean;
    allowStatusVerification: boolean;
}

interface DocProfile {
    emergencyContact: EmergencyContact;
    regulatoryDetails: RegulatoryDetails;
}

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    pronouns: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    address: Address;
    gender: string;
    age: number;
    docProfile: DocProfile;
}

// Register form errors
export interface RegisterFormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    streetAddress1?: string;
    city?: string;
    country?: string;
    gender?: string;
    age?: string;
    emergencyContactEmail?: string;
    emergencyContactRelation?: string;
    emergencyContactFullName?: string;
    emergencyContactPhone?: string;
    authorityName?: string;
    registrationNumber?: string;
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
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pronouns: string;
    role: string;
    isProfileComplete: boolean;
    address: Address;
    authMethod: string;
    createdAt: string;
    emailVerified: boolean;
    fcmTokens: string[];
    phoneVerified: boolean;
}

// Auth Response Types
export interface LoginResponse extends ApiResponse {
    data?: {
        token: string;
        user: User;
    };
    token?: string;
}

export interface RegisterResponse extends ApiResponse {
    token?: string;
    user?:User;
} 