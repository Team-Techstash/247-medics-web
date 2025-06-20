"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MainLayout from '@/app/layouts/MainLayout';
import { 
  FaPaperPlane, 
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaBriefcaseMedical
} from 'react-icons/fa';
import { useParams } from 'next/navigation';
import ImageWithPlaceholder from '@/app/components/ImageWithPlaceholder';

const mockAppointmentData = {
  _id: 'mock-apt-1',
  doctorId: {
    _id: 'doc-1',
    firstName: 'Malik',
    lastName: 'Saleem',
    avatar: null,
  },
  patientId: {
    _id: 'patient-1',
    firstName: 'Sultan',
    lastName: '',
    avatar: null,
  },
  scheduledAt: '2025-06-19T05:35:00.000Z',
  timezone: 'Europe/London Time',
  serviceType: 'Primary Care Consultation',
  paymentStatus: 'free',
  cost: 0,
  messages: [
    {
      _id: 'msg-1',
      sender: 'doc-1',
      message: 'Hi',
      createdAt: '2025-06-19T00:25:16.000Z',
    },
    {
      _id: 'msg-2',
      sender: 'patient-1',
      message: 'Hey. This is a test message. Please ignore.',
      createdAt: '2025-06-19T19:26:40.000Z',
    },
  ],
};

const mockCurrentUser = {
  _id: 'patient-1',
  name: 'Sultan',
  role: 'patient',
};

export default function DoctorAppointmentReviewPage() {
  const params = useParams();
  const appointmentId = params.id;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(mockCurrentUser);
    setAppointment(mockAppointmentData);
    setMessages(mockAppointmentData.messages);
    setLoading(false);
  }, [appointmentId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !appointment) return;
    setSending(true);
    const myMessage = {
      _id: `msg-${Date.now()}`,
      sender: currentUser._id,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, myMessage]);
      setNewMessage('');
      setSending(false);
    }, 500);
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!appointment) return <div className="flex h-screen items-center justify-center">Appointment not found.</div>;

  const { doctorId: doctor, patientId: patient } = appointment;
  const appointmentDate = new Date(appointment.scheduledAt);
  const isPatientView = currentUser?.role === 'patient';
  const chatPartner = isPatientView ? doctor : patient;

  return (
    <MainLayout>
      <div className="bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full p-2">
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Completed
            </h1>
            <div className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 text-left sm:text-center">
                <p><span className="font-semibold">Dear {patient.firstName},</span></p>
                <p className='mt-2'>
                  Thank you for using 24/7 Medics! Following your consultation, you can ask Dr. {doctor.lastName} additional questions within 7 days using the chat below.
                </p>
                <p className='mt-2'>
                  For future medical needs, trust{' '}
                  <a href="#" className="font-semibold text-primary hover:text-secondary">
                    247medics.com
                  </a>{' '}
                  to be there for you.
                </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm">
                {/* Appointment Details Card */}
                <div className="flex items-start gap-6">
                  <ImageWithPlaceholder
                    src={doctor.avatar}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    width={80}
                    height={80}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dr. {doctor.firstName} {doctor.lastName}, MD
                    </h2>
                    <ul className="mt-3 space-y-2 text-gray-600">
                      <li className="flex items-center gap-3">
                        <FaCalendarAlt className="text-gray-500" />
                        <span>
                          {appointmentDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FaClock className="text-gray-500" />
                        <span>
                          {appointmentDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          }).toLowerCase()}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span>{appointment.timezone}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FaBriefcaseMedical className="text-gray-500" />
                        <span>{appointment.serviceType}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Payment Card */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-xl text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appointment.paymentStatus === 'paid' ? 'Paid' : 'Free'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Please remember to collect the invoice from the doctor
                      </p>
                    </div>
                  </div>
                </div>
            </div>
            
            {/* Messaging Section */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Send a message to Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <div className="mt-4 h-80 space-y-4 overflow-y-auto rounded-lg bg-gray-50/80 p-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-2.5 ${msg.sender === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender !== currentUser?._id && (
                      <ImageWithPlaceholder
                        src={chatPartner.avatar}
                        alt={chatPartner.firstName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div
                      className={`max-w-md rounded-xl px-4 py-2 ${
                        msg.sender === currentUser?._id
                          ? 'rounded-br-none bg-primary text-white'
                          : 'rounded-bl-none bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`mt-1 text-xs ${msg.sender === currentUser?._id ? 'text-purple-200' : 'text-gray-500'} text-right`}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message the doctor..."
                  className="flex-1 rounded-full border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-secondary disabled:bg-opacity-50"
                  disabled={sending || !newMessage.trim()}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
