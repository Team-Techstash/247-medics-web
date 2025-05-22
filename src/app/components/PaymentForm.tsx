'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { showToast } from '@/utils/toast';
import { stripeService } from '@/api/services/stripeService';


interface PaymentFormProps {
    appointmentId: string;
    amount: number;
    selectedResponse: any;
    onSuccess: (paymentIntent: any) => void;
}

export default function PaymentForm({ appointmentId, amount, selectedResponse, onSuccess }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        // showToast.loading('Processing payment...');

        try {
            // Create payment intent
            const { clientSecret } = await stripeService.createPaymentIntent({
                appointmentId,
                amount,
                doctorId: selectedResponse.doctorId._id,
            });

            // Confirm payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name,
                        email
                    },
                }
            });

            if (error) {
                showToast.error(error.message || 'Payment failed');
                throw error;
            }

            if (paymentIntent.status === 'succeeded') {
                showToast.success('Payment successful!');
                onSuccess(paymentIntent);
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            showToast.error(error.message || 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
                    Card Details
                </label>
                <div className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm hover:border-primary">
                    <CardElement
                        id="card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
} 