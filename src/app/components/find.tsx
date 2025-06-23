'use client';

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { appointmentsService } from "@/api/services/service";
import { showToast } from "@/utils/toast";
import MainLayout from "../layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchReferences, selectServiceTypes } from "@/redux/slices/referenceSlice";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { io, Socket } from "socket.io-client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Find() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const appointmentId = searchParams.get("id");
    const responseId = searchParams.get("responseId");
    const socketRef = useRef<Socket | null>(null);

    const [appointment, setAppointment] = useState<any>(null);
    const [respondedDoctors, setRespondedDoctors] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const serviceTypes = useSelector(selectServiceTypes);

    useEffect(() => {
        dispatch(fetchReferences());
    }, [dispatch]);

    const getServiceTypeName = (code: string) => {
        if (!code || !serviceTypes) return 'N/A';
        const service = Object.values(serviceTypes).find(item => item.code === code);
        return service ? service.name : code;
    };

    useEffect(() => {
        if (appointmentId) {
            const fetchAppointment = async () => {
                const authToken = localStorage.getItem("authToken");

                // If user is not logged in, call the specific doctor response API
                if (!authToken) {
                    const response = await appointmentsService.getDoctorResponse(appointmentId);
                    if (response.success) {
                        const { responses, appointmentDetails } = response.data;
                        
                        setAppointment(appointmentDetails || {});

                        const normalizedDoctors = responses.map((docResponse: any) => ({
                            ...docResponse,
                            doctor: docResponse.doctorId
                        }));

                        setRespondedDoctors(normalizedDoctors);

                        if (responseId) {
                            const matchingResponse = normalizedDoctors.find(
                                (response: any) => response._id === responseId
                            );
                            if (matchingResponse) {
                                setSelectedResponse(matchingResponse);
                                setShowMobileDetails(true);
                            }
                        }
                        
                    } else {
                        console.error("Failed to fetch doctor response", response.message);
                    }
                    return;
                }
                try {
                    // Check if user is logged in
                    if (authToken) {
                        // Regular flow for logged-in users
                        const response = await appointmentsService.getAppointmentById(appointmentId);
                        if (response.success) {
                            setAppointment(response.data);
                            console.log(response);
                            const normalizedDoctors = response.data.respondedDoctors.map((doctor: any, index: number) => ({
                                ...doctor,
                                doctor: doctor.doctor || doctor.doctorId,
                            }));
                            normalizedDoctors.forEach((doctor: any) => delete doctor.doctorId);
                            setRespondedDoctors(normalizedDoctors);

                            if (responseId) {
                                const matchingResponse = normalizedDoctors.find(
                                    (response: any) => response._id === responseId
                                );
                                if (matchingResponse) {
                                    setSelectedResponse(matchingResponse);
                                    // For responseId in URL, show details on mobile
                                    setShowMobileDetails(true);
                                }
                            }
                        } else {
                            console.error("Failed to fetch appointment", response.message);
                        }
                    }

                } catch (err) {
                    console.error("Error fetching appointment", err);
                }
            };

            fetchAppointment();
        }
    }, [appointmentId, responseId]);

    useEffect(() => {
        if (!appointmentId) return;
        // Initialize Socket.io connection
        socketRef.current = io("https://two47-medics-api.onrender.com", {
            query: { appointmentId },
            transports: ["websocket"],
        });
        socketRef.current.on("connect", () => {
            console.log('Socket.io connected');
            setIsConnected(true);
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    // const base64Url = token.split('.')[1];
                    // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    // }).join(''));
                    // const { id: userId } = JSON.parse(jsonPayload);
                    socketRef.current?.emit("register", { token });
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        });
        socketRef.current.on("doctorResponded", (data: any) => {
            console.log('New doctor response:', data);

            const normalizedData = {
                ...data,
                doctor: data.doctor || data.doctorId,
            };
            delete normalizedData.doctorId;

            showToast.success(`New response from Dr. ${normalizedData.doctor?.firstName} ${normalizedData.doctor?.lastName}`);
            setRespondedDoctors(prev => {
                // Check if this doctor already responded to avoid duplicates
                const exists = prev.some(doc =>
                    doc.doctor?._id === normalizedData.doctor?._id
                );
                return exists ? prev : [...prev, normalizedData];
            });
        });
        socketRef.current.on("disconnect", () => {
            console.log('Socket.io disconnected');
            setIsConnected(false);
        });
        socketRef.current.on("error", (error: any) => {
            console.error('Socket.io error:', error);
            showToast.error('Connection error. Please refresh the page.');
        });
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [appointmentId]);

    const handlePaymentClick = () => {
        if (!selectedResponse) {
            showToast.error('Please select a doctor response first');
            return;
        }

        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
            showToast.error('Please login to continue');
            const currentUrl = window.location.href;
            const loginUrl = `/login?from=${encodeURIComponent(currentUrl)}&responseId=${selectedResponse._id}`;
            router.push(loginUrl);
            return;
        }

        const response = {
            ...selectedResponse,
            doctor: selectedResponse.doctor || selectedResponse.doctorId,
        };
        delete response.doctorId;

        router.push(`/payment?appointmentId=${appointmentId}`);
        localStorage.setItem('selectedResponse', JSON.stringify(response));
    };

    // Add a function to normalize doctor data
    const normalizeDoctorData = (data: any) => {
        if (!data) return data;
        const normalized = {
            ...data,
            doctor: data.doctor || data.doctorId,
        };
        delete normalized.doctorId;
        return normalized;
    };

    // Modify the setSelectedResponse to use normalized data
    const handleSelectResponse = (item: any) => {
        setSelectedResponse(normalizeDoctorData(item));
        // On mobile, show details and hide the list
        setShowMobileDetails(true);
    };

    // Function to go back to list view on mobile
    const handleBackToList = () => {
        setShowMobileDetails(false);
    };

    const handlePrevReviews = () => {
        setCurrentReviewIndex(prev => Math.max(0, prev - 3));
    };

    const handleNextReviews = () => {
        if (!selectedResponse) return;
        const reviews = selectedResponse.doctor?.latestReviews || [];
        setCurrentReviewIndex(prev => {
            const maxIndex = Math.max(0, reviews.length - 3);
            return Math.min(maxIndex, prev + 3);
        });
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl ">

                    {respondedDoctors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                            <AiOutlineLoading3Quarters className="w-12 h-12 text-[#9904A1] animate-spin" />
                            {!responseId && (
                                <h2 className="text-lg text-[#9904A1] max-w-lg">
                                    We've sent your request to the relevant doctors. Please wait for the doctors to respond to your request.
                                </h2>
                            )}
                        </div>
                    ) : responseId && !selectedResponse ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                            <h2 className="text-lg text-red-500 max-w-lg">
                                Invalid response ID. The requested response could not be found.
                            </h2>
                        </div>
                    ) : (
                        <div className={`grid ${responseId ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                            {/* Left side: Doctor Responses List - Show on desktop or mobile list view */}
                            {(!responseId || (responseId && !showMobileDetails)) && (
                                <div className={`col-span-1 p-6 bg-white max-h-[calc(100vh-200px)] overflow-y-auto relative after:content-[''] after:absolute after:right-0 after:top-4 after:bottom-4 after:w-[1px] after:bg-[#9904A1]/20 ${
                                    showMobileDetails ? 'hidden md:block' : 'block'
                                }`}>
                                    <h2 className="text-lg font-semibold text-[#9904A1] my-6 text-center tracking-wide">Doctor Responses</h2>

                                    {respondedDoctors.map((item, index) => {
                                        const reviews = item.doctor?.latestReviews || [];
                                        const averageRating = reviews.length
                                            ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length)
                                            : 0;
                                        return (
                                            <div
                                                key={index}
                                                className={`cursor-pointer mb-3 p-4 rounded-2xl shadow-sm transition-all duration-200 ${selectedResponse === item
                                                    ? 'bg-[#faf8fc] ring-1 ring-[#9904A1]'
                                                    : 'bg-white hover:bg-gray-50 shadow-md'
                                                    }`}
                                                onClick={() => handleSelectResponse(item)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium text-[#9904A1] text-md">
                                                        Dr. {item.doctor?.firstName} {item.doctor?.lastName}
                                                    </h3>
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg
                                                                        key={i}
                                                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-base font-bold text-gray-700">{averageRating.toFixed(1)}</span>
                                                            <span className="text-sm text-gray-600">({reviews.length})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Appointment Time: {item.dateTime
                                                        ? new Date(item.dateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                                        : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-600">Appointment Fee: ${item.price}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Right side: Selected Response Details - Show on desktop or mobile details view */}
                            <div className={`col-span-2 p-8 bg-white flex flex-col justify-center items-center ${
                                showMobileDetails ? 'block' : 'hidden md:block'
                            }`}>
                                {/* Mobile Back Button */}
                                {(showMobileDetails ) && (
                                    <div className="w-full my-6 md:hidden">
                                        <button
                                            onClick={handleBackToList}
                                            className="flex items-center gap-2 text-[#9904A1] hover:text-[#7e0487] transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            <span className="font-medium">Back to Responses</span>
                                        </button>
                                    </div>
                                )}
                                
                                <h2 className="text-xl font-semibold text-[#9904A1] mb-8 text-center tracking-wide sticky top-0 bg-white z-10">Response Details</h2>

                                {selectedResponse ? (
                                    <div className={`space-y-6 pr-4 ${responseId ? 'md:w-[80%]' : ''}`}>
                                        {/* Doctor Info */}
                                        <div className="bg-white shadow-md border border-gray-200 rounded-2xl">
                                            <h2 className="text-lg bg-[#faf8fc] font-semibold text-[#9904A1] mb-2 border-b border-gray-200 py-2 px-5 rounded-t-2xl ">Doctor Details</h2>
                                            <div className="p-5">
                                                {selectedResponse && (() => {
                                                    const reviews = selectedResponse.doctor?.latestReviews || [];
                                                    const averageRating = reviews.length
                                                        ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length)
                                                        : 0;
                                                    return (
                                                        <>
                                                            <div className="flex sm:items-center sm:justify-between gap-2 mb-4">
                                                                <p className="text-gray-700 flex-shrink-0"><span className="font-medium">Name:</span> Dr. {selectedResponse.doctor?.firstName} {selectedResponse.doctor?.lastName}</p>
                                                                <div className="flex lg:flex-row flex-col items-center self-start sm:self-center gap-2 lg:w-auto w-full justify-end">
                                                                    <div className="flex items-center w-full justify-end">
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <svg
                                                                                key={index}
                                                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-sm text-gray-600 w-full text-end">{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                {reviews.length > 0 && (
                                                                    <>
                                                                        <h3 className="text-md font-semibold text-gray-800 mb-4">Recent Reviews</h3>
                                                                        <div className="relative">
                                                                            <div className="flex items-center">
                                                                                <button
                                                                                    onClick={handlePrevReviews}
                                                                                    disabled={currentReviewIndex === 0}
                                                                                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                >
                                                                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                                                                </button>

                                                                                <div className="flex-1 overflow-hidden">
                                                                                    <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentReviewIndex * (100 / 3)}%)` }}>
                                                                                        {reviews.map((review: any) => (
                                                                                            <div
                                                                                                key={review._id}
                                                                                                className="flex-shrink-0 px-2 w-full sm:w-1/2 lg:w-1/3"
                                                                                            >
                                                                                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full">
                                                                                                    <div className="flex items-center gap-2 mb-2">
                                                                                                        <div className="flex">
                                                                                                            {[...Array(5)].map((_, i) => (
                                                                                                                <svg
                                                                                                                    key={i}
                                                                                                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                                                    fill="currentColor"
                                                                                                                    viewBox="0 0 20 20"
                                                                                                                >
                                                                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                                                </svg>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                                                                    </div>
                                                                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{review.comment || ""}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>

                                                                                <button
                                                                                    onClick={handleNextReviews}
                                                                                    disabled={currentReviewIndex >= reviews.length - 3}
                                                                                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                >
                                                                                    <ChevronRight className="w-6 h-6 text-gray-600" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Appointment Info */}
                                        <div className="bg-white shadow-md border border-gray-200 rounded-2xl">
                                            <h2 className="text-lg bg-[#faf8fc] font-semibold text-[#9904A1] mb-2 border-b border-gray-200 py-2 px-5 rounded-t-2xl ">Appointment Details</h2>
                                            <div className="p-5">
                                                <p className="text-gray-700"><span className="font-medium">Date & Time:</span> {selectedResponse.dateTime
                                                    ? new Date(selectedResponse.dateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                                    : 'N/A'}</p>
                                                <p className="text-gray-700"><span className="font-medium">Service Type:</span> {getServiceTypeName(appointment?.serviceType)}</p>
                                                <p className="text-gray-700"><span className="font-medium">Location:</span> {appointment?.city}, {appointment?.country}</p>
                                                <p className="text-gray-700"><span className="font-medium">Notes:</span> {selectedResponse.notes || 'No additional notes provided.'}</p>
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="bg-white shadow-md border border-gray-200 rounded-2xl">
                                            <h2 className="text-lg bg-[#faf8fc] font-semibold text-[#9904A1] mb-2 border-b border-gray-200 py-2 px-5 rounded-t-2xl ">Payment</h2>
                                            <div className="p-5">
                                                <p className="mb-4 text-gray-700"><span className="font-medium">Appointment Fee:</span> ${selectedResponse.price}</p>
                                                <button
                                                    onClick={handlePaymentClick}
                                                    className="px-6 py-2 bg-[#9904A1] text-white rounded-2xl hover:bg-[#7e0487] transition shadow-md"
                                                >
                                                    Pay Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[calc(100vh-400px)] text-gray-500 text-base">
                                        Select a doctor response to view details
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
