'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import { showToast } from '@/utils/toast';
import Link from "next/link";
import Image from "next/image";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const selectedResponse = JSON.parse(localStorage.getItem('selectedResponse') || '{}');
    console.log(selectedResponse)
    if (!appointmentId || !selectedResponse) {
        router.push('/');
        return null;
    }

    const handlePaymentSuccess = (paymentIntent: any) => {
        showToast.success('Your appointment has been booked')
        
        router.push(`/appointments/${appointmentId}`);
    };

    return (
        <Elements stripe={stripePromise}>

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex justify-center mb-6">
                    <Image
                        src="/images/logo.svg"
                        alt="24/7 Medics"
                        width={140}
                        height={50}
                        className="mx-auto"
                    />
                </Link>
                <div className="max-w-md mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Complete Your Payment
                        </h2>
                        <div className="mt-4 text-gray-600">
                            <p>Doctor:  <strong className='text-primary'> {selectedResponse.doctorId.firstName} {selectedResponse.doctorId.lastName}</strong></p>
                            <p>
                                Appointment Time:
                                <strong className="text-primary">
                                    {new Date(selectedResponse.dateTime).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </strong>
                            </p>

                            <p>Amount: <strong className='text-primary'>${parseFloat(selectedResponse.price).toFixed(2)}</strong></p>
                        </div>
                    </div>

                    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <PaymentForm
                            appointmentId={appointmentId}
                            selectedResponse={selectedResponse}
                            amount={parseFloat(selectedResponse.price)}
                            onSuccess={handlePaymentSuccess}
                        />
                    </div>
                </div>
            </div>
        </Elements>

    );
} 