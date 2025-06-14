"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ReviewFormProps {
    onSubmit: (reviewData: ReviewData) => void;
    isLoading?: boolean;
}

interface ReviewData {
    rating: number;
    comment: string;
}

export default function ReviewForm({ onSubmit, isLoading }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

    const validateForm = () => {
        const newErrors: { rating?: string; comment?: string } = {};
        let isValid = true;

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({ rating, comment });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col items-center gap-6">
            <div className="w-full text-center">
                <label className="block text-2xl font-bold text-gray-900 mb-1">Feedback Us</label>
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => router.push("/appointments")}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200"
                    >
                        &larr; Back to Appointment List
                    </button>
                </div>
            </div>
            <div className='w-full max-w-xl mx-auto bg-white rounded-2xl shadow-md px-6 py-8'>
                <p className="text-gray-500 text-center text-sm mb-4">How was your experience with your doctor and this appointment? Your feedback helps us improve our care.</p>
                <div className="flex flex-col items-center w-full gap-2 ">
                    <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className="text-2xl focus:outline-none"
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    <FaStar
                                        className="cursor-pointer transition-transform hover:scale-110"
                                        color={ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                                        size={30}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    {errors.rating && (
                        <p className="text-red-500 !text-sm mt-1">{errors.rating}</p>
                    )}
                </div>
                <div className="w-full">
                    <label htmlFor="comment" className="block text-base font-medium text-gray-700 mb-2">
                        Write Your Experiences
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base resize-none"
                        placeholder="Type here..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl text-md font-semibold shadow-md bg-secondary hover:bg-primary text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>

        </form>
    );
} 