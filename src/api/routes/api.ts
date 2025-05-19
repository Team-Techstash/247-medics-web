export const AUTH_ROUTES = {
    // Login routes
    LOGIN: {
        EMAIL: 'users/email-login',
    },
    
    // Registration routes
    REGISTER: {
        EMAIL: 'users/email-signup',
    },
} as const; 

export const APPOINTMENTS_ROUTES = {
    CREATE: 'appointments/',
    GET_APPOINTMENTS: 'appointments',
    GET_APPOINTMENT_BY_ID: (id: string) => `appointments/${id}`,
} as const; 