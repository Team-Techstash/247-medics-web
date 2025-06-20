"use client";

import React from 'react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';
import { showToast } from '@/utils/toast';
import MainLayout from '@/app/layouts/MainLayout';
import { reviewsService } from '@/api/services/service';

const AppointmentReviewPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.id as string;
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
        setIsSubmittingReview(true);
        try {
            const response = await reviewsService.create({
                ...reviewData,
                appointmentId
            });

            if (response && response._id) {
                showToast.success('Review submitted successfully!');
                router.push('/appointments');
            } else {
                showToast.error('Failed to submit review');
            }
        } catch (error: any) {
            console.error('Review submission error:', error);
            showToast.error(error?.message || 'Failed to submit review. Please try again.');
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
