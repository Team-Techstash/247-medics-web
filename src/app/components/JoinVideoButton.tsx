'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface JoinVideoButtonProps {
  appointmentId: string;
  token: string;
  className?: string;
}

const JoinVideoButton: React.FC<JoinVideoButtonProps> = ({ 
  appointmentId, 
  token,
  className = ''
}) => {
  const router = useRouter();

  const handleJoinVideo = () => {
    router.push(`/appointments/join-meeting/${appointmentId}/${token}`);
  };

  return (
    <button
      onClick={handleJoinVideo}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className}`}
    >
      Join Video Consultation
    </button>
  );
};

export default JoinVideoButton; 