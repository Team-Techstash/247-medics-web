'use client';

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { appointmentsService } from "@/api/services/service";
import { showToast } from "@/utils/toast";
import MainLayout from "../layouts/MainLayout";
import { io, Socket } from "socket.io-client";

export default function Find() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const appointmentId = searchParams.get("id");
    const socketRef = useRef<Socket | null>(null);

    const [appointment, setAppointment] = useState<any>(null);
    const [respondedDoctors, setRespondedDoctors] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (appointmentId) {
            const fetchAppointment = async () => {
                try {
                    const response = await appointmentsService.getAppointmentById(appointmentId);
                    if (response.success) {
                        setAppointment(response.data);
                        console.log(response)
                        setRespondedDoctors(response.data.respondedDoctors)

                    } else {
                        console.error("Failed to fetch appointment", response.message);
                    }
                } catch (err) {
                    console.error("Error fetching appointment", err);
                }
            };

            fetchAppointment();
        }
    }, [appointmentId]);

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
            showToast.success(`New response from Dr. ${data.doctor?.firstName} ${data.doctor?.lastName}`);
            setRespondedDoctors(prev => {
                // Check if this doctor already responded to avoid duplicates
                const exists = prev.some(doc =>
                    doc.doctor?._id === data.doctor?._id
                );
                return exists ? prev : [...prev, data];
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
        router.push(`/payment?appointmentId=${appointmentId}`);

        localStorage.setItem('selectedResponse', JSON.stringify(selectedResponse));

    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl ">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Left side: Doctor Responses List */}
                        <div className="col-span-1 p-6 bg-white max-h-[calc(100vh-200px)] overflow-y-auto relative after:content-[''] after:absolute after:right-0 after:top-4 after:bottom-4 after:w-[1px] after:bg-[#9904A1]/20">
                            <h2 className="text-lg font-semibold text-[#9904A1] mb-4 text-center tracking-wide">Doctor Responses</h2>

                            {respondedDoctors.map((item, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer mb-3 p-4 rounded-2xl shadow-sm transition-all duration-200 ${selectedResponse === item
                                        ? 'bg-[#faf8fc] ring-1 ring-[#9904A1]'
                                        : 'bg-white hover:bg-gray-50 shadow-md'
                                        }`}
                                    onClick={() => setSelectedResponse(item)}
                                >
                                    <h3 className="font-medium text-[#9904A1] text-md">
                                        Dr. {item.doctorId?.firstName} {item.doctorId?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Appointment Time: {item.dateTime
                                            ? new Date(item.dateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">Appointment Fee: ${item.price}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right side: Selected Response Details */}
                        <div className="col-span-2 p-8 bg-white flex flex-col">
                            <h2 className="text-xl font-semibold text-[#9904A1] mb-8 text-center tracking-wide sticky top-0 bg-white z-10">Appointment Proposal</h2>

                            {selectedResponse ? (
                                <div className="space-y-6 pr-4">
                                    {/* Doctor Info */}
                                    {/* bg-[#faf8fc] */}
                                    <div className="bg-white shadow-md border border-gray-200 rounded-2xl">
                                        <h2 className="text-lg bg-[#faf8fc] font-semibold text-[#9904A1] mb-2 border-b border-gray-200 py-2 px-5 rounded-t-2xl ">Doctor Details</h2>
                                        <div className="p-5">
                                            <p className="text-gray-700"><span className="font-medium">Name:</span> Dr. {selectedResponse.doctorId?.firstName} {selectedResponse.doctorId?.lastName}</p>
                                            {/* <p className="text-gray-700"><span className="font-medium">Email:</span> {selectedResponse.doctorId?.email}</p> */}
                                        </div>

                                    </div>

                                    {/* Appointment Info */}
                                    <div className="bg-white shadow-md border border-gray-200 rounded-2xl">
                                        <h2 className="text-lg bg-[#faf8fc] font-semibold text-[#9904A1] mb-2 border-b border-gray-200 py-2 px-5 rounded-t-2xl ">Appointment Details</h2>
                                        <div className="p-5">
                                            <p className="text-gray-700"><span className="font-medium">Date & Time:</span> {selectedResponse.dateTime
                                                ? new Date(selectedResponse.dateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                                : 'N/A'}</p>
                                            <p className="text-gray-700"><span className="font-medium">Service Type:</span> {appointment?.serviceType || 'N/A'}</p>
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
                </div>
            </div>
        </MainLayout>
    );
}
