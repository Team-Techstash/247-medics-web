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
        GOOGLE: 'users/google-signup',
    },
} as const; 

export const APPOINTMENTS_ROUTES = {
    CREATE: 'appointments/',
    GET_APPOINTMENTS: 'appointments',
    GET_APPOINTMENT_BY_ID: (id: string) => `appointments/${id}`,
} as const; 

export const REFERENCE_ROUTES = {
    GET_REFERENCES: 'users/references',
} as const; 