import { appointmentsService } from './service';
const API_BASE_URL = 'http://3.14.150.170:5000/api';

export const stripeService = {
    createPaymentIntent: async (data: {
        appointmentId: string;
        amount: number;
        doctorId: string;
    }) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/appointments/payment-intent`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    confirmPayment: async (clientSecret: string, paymentMethod: any) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/appointments/confirm-payment`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    clientSecret,
                    paymentMethod,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to confirm payment');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
}; 