"use client";

import React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';
import { showToast } from '@/utils/toast';
import MainLayout from '@/app/layouts/MainLayout';

const AppointmentReviewPage: React.FC = () => {
    const params = useParams();
    const appointmentId = params.id as string;
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
        setIsSubmittingReview(true);
        try {
            console.log('Review submitted for appointment:', appointmentId, reviewData);
            showToast.success('Review submitted successfully!');
        } catch (error: any) {
            showToast.error(error.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <MainLayout>
                <ReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
        </MainLayout>
    );
};

export default AppointmentReviewPage;
