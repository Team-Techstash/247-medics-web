'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { appointmentsService } from "@/api/services/service";
import { showToast } from "@/utils/toast";
import MainLayout from "../layouts/MainLayout";

export default function Find() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const appointmentId = searchParams.get("id");

    const [appointment, setAppointment] = useState<any>(null);
    const [respondedDoctors, setRespondedDoctors] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<any>(null);

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
                <div className="bg-white rounded-3xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Left side: Doctor Responses List */}
                        <div className="col-span-1 p-6 bg-[#fdfbff] max-h-[calc(100vh-200px)] overflow-y-auto relative after:content-[''] after:absolute after:right-0 after:top-4 after:bottom-4 after:w-[1px] after:bg-[#9904A1]/20">
                            <h2 className="text-lg font-semibold text-[#9904A1] mb-4 text-center tracking-wide">Doctor Responses</h2>

                            {respondedDoctors.map((item, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer mb-3 p-4 rounded-2xl shadow-sm transition-all duration-200 ${selectedResponse === item
                                        ? 'bg-[#f3e7f5] ring-2 ring-[#9904A1]'
                                        : 'bg-white hover:bg-gray-50 shadow-md'
                                        }`}
                                    onClick={() => setSelectedResponse(item)}
                                >
                                    <h3 className="font-medium text-[#9904A1] text-md">
                                        Dr. {item.doctorId?.firstName} {item.doctorId?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Appointment: {item.appointmentTime
                                            ? new Date(item.appointmentTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">Price: ${item.price}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right side: Selected Response Details */}
                        <div className="col-span-2 p-8 bg-white flex flex-col">
                            <h2 className="text-xl font-semibold text-[#9904A1] mb-8 text-center tracking-wide sticky top-0 bg-white py-4 z-10">Appointment Proposal</h2>

                            {selectedResponse ? (
                                <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                                    {/* Doctor Info */}
                                    <div className="bg-[#faf8fc] shadow-md rounded-2xl p-5">
                                        <h2 className="text-lg font-semibold text-[#9904A1] mb-2">Doctor Details</h2>
                                        <p className="text-gray-700"><span className="font-medium">Name:</span> Dr. {selectedResponse.doctorId?.firstName} {selectedResponse.doctorId?.lastName}</p>
                                        <p className="text-gray-700"><span className="font-medium">Email:</span> {selectedResponse.doctorId?.email}</p>
                                    </div>

                                    {/* Appointment Info */}
                                    <div className="bg-[#faf8fc] shadow-md rounded-2xl p-5">
                                        <h2 className="text-lg font-semibold text-[#9904A1] mb-2">Appointment Details</h2>
                                        <p className="text-gray-700"><span className="font-medium">Date & Time:</span> {selectedResponse.appointmentTime
                                            ? new Date(selectedResponse.appointmentTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'N/A'}</p>
                                        <p className="text-gray-700"><span className="font-medium">Service Type:</span> {appointment?.serviceType || 'N/A'}</p>
                                        <p className="text-gray-700"><span className="font-medium">Location:</span> {appointment?.city}, {appointment?.country}</p>
                                        <p className="text-gray-700"><span className="font-medium">Notes:</span> {selectedResponse.notes || 'No additional notes provided.'}</p>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="bg-[#faf8fc] shadow-md rounded-2xl p-5">
                                        <h2 className="text-lg font-semibold text-[#9904A1] mb-2">Payment</h2>
                                        <p className="mb-4 text-gray-700"><span className="font-medium">Amount:</span> ${selectedResponse.price}</p>
                                        <button
                                            onClick={handlePaymentClick}
                                            className="px-6 py-2 bg-[#9904A1] text-white rounded-2xl hover:bg-[#7e0487] transition shadow-md"
                                        >
                                            Pay Now
                                        </button>
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
