'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentsService } from '@/api/services/service';
import Header from './Header';
import Footer from './Footer';
import { MdInfoOutline } from 'react-icons/md';
import { FaInfoCircle } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa';
import JoinVideoButton from './JoinVideoButton';

interface Appointment {
    _id: string;
    status: string;
    createdAt: string;
    email?: string;
    phone?: string;
    paymentStatus?: string;
    scheduledAt?: string;
    doctorId?: {
        firstName: string;
        lastName: string;
    };
    patientId?: {
        email?: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
}

type TabType = 'upcoming' | 'completed';

export default function PatientAppointmentList() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [dateFilter, setDateFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line
    }, [dateFilter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentsService.getAppointments(
                undefined,
                '-scheduledAt'
            );
            console.log('Appointments response:', response);
            // Map the data to flatten patient info
            const mapped = (response.data || []).map((item: any) => ({
                _id: item._id,
                email: item.patientId?.email || '',
                firstName: item.patientId?.firstName || '',
                lastName: item.patientId?.lastName || '',
                phone: item.patientId?.phone || '',
                status: item.status,
                paymentStatus: item.paymentStatus || 'pending',
                createdAt: item.createdAt,
                scheduledAt: item.scheduledAt,
                doctorId: item.doctorId,
            }));
            console.log('Mapped appointments:', mapped);
            setAppointments(mapped);
            setError('');
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    // Filtering
    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.phone?.toLowerCase().includes(searchTerm.toLowerCase());

        const isCompleted = appointment.status === 'completed';
        const matchesTab = activeTab === 'completed' ? isCompleted : !isCompleted;

        return matchesSearch && matchesTab;
    });

    // Pagination logic
    const totalRows = filteredAppointments.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedAppointments = filteredAppointments.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'requested':
                return 'bg-blue-100 text-blue-600';
            case 'pending':
                return 'bg-orange-100 text-orange-600';
            case 'confirmed':
                return 'bg-green-100 text-green-600';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-600';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-red-100 text-red-600';
        }
    };

    // Payment status badge color
    const getPaymentStatusBadge = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-orange-100 text-orange-600';
            case 'failed':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-20">
                {/* Breadcrumb */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Appointment</h1>
                    <div className="text-sm text-gray-400">
                        <span className="text-primary font-medium">Appointment List</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    {/* Filters Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9904A1]"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`px-4 py-2 text-md font-medium ${activeTab === 'upcoming'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white text-[#9904A1] hover:bg-gray-50'
                                        }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`px-4 py-2 text-md font-medium ${activeTab === 'completed'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white text-[#9904A1] hover:bg-gray-50'
                                        }`}
                                >
                                    Completed
                                </button>
                            </div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9904A1]"
                            />
                        </div>
                    </div>

                    {/* Error message above table */}
                    {error && (
                        <div className="mb-4 text-center text-red-500 font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <th className="px-6 py-3 text-left font-medium">Doctor Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Appointment Date/Time</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Payment Status</th>
                                    <th className="px-6 py-3 text-center font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : paginatedAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAppointments.map((appointment) => (
                                        <tr key={appointment._id} className="border-t border-gray-100">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {appointment.scheduledAt
                                                        ? new Date(appointment.scheduledAt).toLocaleString()
                                                        : "N/A"}

                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(appointment.status)}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusBadge(appointment.paymentStatus)}`}>
                                                    {appointment.paymentStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        className="text-gray-400 hover:text-gray-500"
                                                        title="View Details"
                                                        onClick={() => router.push(`/appointments/${appointment._id}`)}
                                                    >
                                                        <FaInfoCircle className="text-xl" />
                                                    </button>
                                                    {(appointment.status === 'in-progress' || appointment.status === 'confirmed') && (
                                                        <JoinVideoButton
                                                            appointmentId={appointment._id}
                                                            token={localStorage.getItem('authToken') || ''}
                                                            className="text-[#9904A1] hover:text-[#9904A1]"
                                                            status={appointment.status}
                                                        />
                                                    )}
                                                    {(appointment.status === 'requested' || appointment.status === 'pending') && (
                                                        <button onClick={() => router.push(`/find?id=${appointment._id}`) }
                                                            className="text-pink-500 hover:text-[#9904A1] px-3 py-1.5 border border-pink-500 rounded-full hover:bg-[#4A154D] hover:border-[#4A154D] hover:text-white transition-colors text-sm">
                                                            View Doctors Response
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-3 py-1 mx-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 mx-1">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="px-3 py-1 mx-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main >
            <Footer />
        </div >
    );
}
