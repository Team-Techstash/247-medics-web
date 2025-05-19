'use client';

import { useState, useEffect } from 'react';
import { appointmentsService } from '@/api/services/service';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useRouter } from 'next/navigation';

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Please login to view appointment details');
          return;
        }

        const response = await appointmentsService.getAppointmentById(params.id);
        if (response.success) {
          setAppointment(response.data);
        } else {
          setError(response.message || 'Failed to fetch appointment details');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch appointment details');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [params.id]);

  if (error === 'Please login to view appointment details') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please login to view appointment details</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Appointment Details</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => router.push('/appointments')}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200"
          >
            &larr; Back to Appointment List
          </button>
        </div>
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow p-10 w-full max-w-4xl min-w-[340px] md:min-w-[600px] lg:min-w-[800px]">
            {loading ? (
              <div className="text-gray-400 text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : !appointment ? (
              <div className="text-gray-400 text-center">No appointment found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                {/* Patient Name */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Patient Name</div>
                  <div className="font-bold text-gray-800">{appointment.patientId?.firstName} {appointment.patientId?.lastName}</div>
                </div>
                {/* Email */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Email</div>
                  <div className="font-bold text-gray-800">{appointment.patientId?.email}</div>
                </div>
                {/* Phone */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Phone</div>
                  <div className="font-bold text-gray-800">{appointment.patientId?.phone}</div>
                </div>
                {/* Status */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Status</div>
                  <div className="font-bold text-gray-800 capitalize">{appointment.status.replace('-', ' ')}</div>
                </div>
                {/* Service Type */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Service Type</div>
                  <div className="font-bold text-gray-800">{appointment.serviceType}</div>
                </div>
                {/* Appointment Mode */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Appointment Mode</div>
                  <div className="font-bold text-gray-800">{appointment.appointmentMode}</div>
                </div>
                {/* City */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">City</div>
                  <div className="font-bold text-gray-800">{appointment.city}</div>
                </div>
                {/* Country */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Country</div>
                  <div className="font-bold text-gray-800">{appointment.country}</div>
                </div>
                {/* Payment Status */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Payment Status</div>
                  <div className="font-bold text-gray-800 capitalize">{appointment.paymentStatus}</div>
                </div>
                {/* Visit Type */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Visit Type</div>
                  <div className="font-bold text-gray-800 capitalize">{appointment.visitType?.replace('-', ' ')}</div>
                </div>
                {/* Duration */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Duration</div>
                  <div className="font-bold text-gray-800">{appointment.durationMinutes} minutes</div>
                </div>
                {/* Created At */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Created At</div>
                  <div className="font-bold text-gray-800">{new Date(appointment.createdAt).toLocaleDateString()}</div>
                </div>
                {/* Reason (full width) */}
                <div className="md:col-span-3 mt-2">
                  <div className="text-xs text-gray-500 font-semibold">Reason</div>
                  <div className="font-bold text-gray-800 mt-1">{appointment.reason}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 