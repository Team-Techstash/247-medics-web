export const AUTH_ROUTES = {
    // Login routes
    LOGIN: {
        EMAIL: 'users/email-login',
    },

    FORGOT_PASSWORD: 'users/forgot-password',
    RESET_PASSWORD: (token: string) => `users/reset-password/${token}`,
    // Registration routes
    REGISTER: {
        EMAIL: 'users/email-signup',
        GOOGLE: 'users/google-auth',
    },
    // Profile routes
    PROFILE: {
        UPDATE: (id: string) => `users/${id}`,
        GET_USER: 'users/profile',
        REFRESH_TOKEN: 'users/refresh-token'
    },
} as const; 

export const APPOINTMENTS_ROUTES = {
    CREATE: 'appointments/',
    GET_APPOINTMENTS: 'appointments',
    GET_APPOINTMENT_BY_ID: (id: string) => `appointments/${id}`,
    GET_DOCTOR_RESPONSES: (appointmentId: string) => `appointments/doctor-response/${appointmentId}`,
} as const; 

export const CHAT_ROUTES = {
    GET_MESSAGES: (chatId: string, limit: number = 30, page: number = 1) => 
        `chat/messages/${chatId}?limit=${limit}&page=${page}`,
    GET_CHAT_SESSION: 'chat/session',
} as const;

export const REVIEWS_ROUTES = {
    CREATE: 'reviews',
} as const;

export const REFERENCE_ROUTES = {
    GET_REFERENCES: 'users/references',
} as const; 

export const DOCTOR_ROUTES = {
    CHECK_STRIPE_ONBOARDING: 'users/check-stripe-onboarding',
    ONBOARDING_SETUP: 'users/doctor-onboarding-link',
} as const; 

export const COUNTRY_ROUTES = {
    GET_COUNTRIES: 'country',
    GET_CITIES: (q: string = 'te', countryCode: string) => `country/cities?${q ? `q=${q}` : ''}&countryCode=${countryCode}`,
} as const; 