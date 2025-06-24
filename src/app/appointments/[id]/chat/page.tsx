"use client";

import { useState, useEffect, useRef } from 'react';
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
import { appointmentsService } from '@/api/services/service';
import { chatService } from '@/api/services/chatService';
import { websocketService, ChatMessage } from '@/api/services/websocketService';
import { formatMessageTime, validateMessage, generateTempMessageId, isOwnMessage } from '@/utils/chatUtils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { 
  fetchReferences, 
  selectServiceTypes,
  selectReferencesLoading 
} from '@/redux/slices/referenceSlice';

export default function DoctorAppointmentReviewPage() {
  const params = useParams();
  const appointmentId = params.id;
  const dispatch = useDispatch<AppDispatch>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Get reference data from Redux
  const serviceTypes = useSelector(selectServiceTypes);
  const referencesLoading = useSelector(selectReferencesLoading);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchReferences());
  }, [dispatch]);

  // Helper function to get reference name by code
  const getReferenceName = (code: string, referenceData: { [key: string]: any }) => {
    const item = Object.values(referenceData).find((item: any) => item.code === code);
    return item ? item.name : code;
  };

  // Establish WebSocket connection on mount and set up listeners
  useEffect(() => {
    websocketService.connect();

    websocketService.setCallbacks({
      onConnect: () => setWsConnected(true),
      onDisconnect: () => setWsConnected(false),
      onMessage: (message: ChatMessage) => {
        // When a message is sent, it's added to the UI optimistically.
        // To prevent duplication, we check if the sender is the current user.
        // If so, we replace the temporary message with the real one from the server.
        if (currentUser && message.senderId === currentUser._id) {
          setMessages(prev =>
            prev.map(m =>
              (m._id.startsWith('temp-') && m.content.text === message.content.text)
                ? message
                : m
            )
          );
        } else {
          setMessages(prev => [...prev, message]);
        }
      },
      onError: (error: string) => {
        console.error('WebSocket error:', error);
        setError(error);
      },
    });

    return () => {
      websocketService.disconnect();
    };
  }, [currentUser]);

  // Fetch initial data (appointment, chat session, messages)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please login to view appointment details");
          return;
        }

        // 1. Fetch appointment details
        const appointmentResponse = await appointmentsService.getAppointmentById(appointmentId as string);
        if (appointmentResponse.success) {
          const appointmentData = appointmentResponse.data;
          setAppointment(appointmentData);
          setCurrentUser({
            _id: appointmentData.patientId?._id || 'patient-1',
            name: appointmentData.patientId?.firstName || 'Patient',
            role: 'patient',
          });
        } else {
          setError(appointmentResponse.message || "Failed to fetch appointment details");
          return;
        }

        // 2. Get chat session and messages
        const chatResponse = await chatService.getChatSession(appointmentId as string);
        if (chatResponse && chatResponse._id) {
          const newChatId = chatResponse._id;
          setChatId(newChatId);

          const messagesResponse = await chatService.getMessages(newChatId);
          if (messagesResponse && Array.isArray(messagesResponse.messages)) {
            setMessages(messagesResponse.messages || []);
          }
        } else {
          setError("Failed to initialize chat session");
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch page data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchInitialData();
    }
  }, [appointmentId, dispatch]);

  // Join the chat room once connected and chatId is available
  useEffect(() => {
    if (wsConnected && chatId) {
      websocketService.joinChat(chatId);
    }
  }, [wsConnected, chatId]);

  // Scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !appointment || !chatId) return;
    
    // Validate message
    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid message');
      return;
    }
    
    setSending(true);
    
    try {
      // Send message via WebSocket
      websocketService.sendMessage(
        chatId,
        newMessage,
        [], // attachments
        appointmentId as string
      );

      // Optimistically add message to UI
      const tempMessage: ChatMessage = {
        _id: generateTempMessageId(),
        chatId,
        senderId: currentUser._id,
        content: {
          text: newMessage,
          attachments: []
        },
        appointmentId: appointmentId as string,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      setError(null); // Clear any previous errors

      // Scroll the chat container to the bottom to show the new message
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTop = container.scrollHeight;
        }
      }, 50);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading || referencesLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
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
                <p><span className="font-semibold">Dear {patient?.firstName || 'Patient'},</span></p>
                <p className='mt-2'>
                  Thank you for using 24/7 Medics! Following your consultation, you can ask Dr. {doctor?.lastName || doctor?.firstName} additional questions within 7 days using the chat below.
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
                    src={doctor?.avatar}
                    alt={`Dr. ${doctor?.firstName || ''} ${doctor?.lastName || ''}`}
                    width={80}
                    height={80}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dr. {doctor?.firstName || ''} {doctor?.lastName || ''}
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
                        <span>{appointment.timezone || 'UTC'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FaBriefcaseMedical className="text-gray-500" />
                        <span>{getReferenceName(appointment.serviceType, serviceTypes)}</span>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Send a message to Dr. {doctor?.firstName || ''} {doctor?.lastName || ''}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {wsConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div
                ref={messagesContainerRef}
                className="mt-4 h-80 space-y-4 overflow-y-auto rounded-lg bg-gray-50/80 p-4"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isOwnMessage(msg, currentUser?._id) ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          isOwnMessage(msg, currentUser?._id)
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.content.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                 <div ref={bottomRef} />
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  disabled={sending || !wsConnected}
                  maxLength={1000}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending || !wsConnected}
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
              {newMessage.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 text-right">
                  {newMessage.length}/1000 characters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
