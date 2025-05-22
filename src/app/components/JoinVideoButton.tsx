'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface JoinVideoButtonProps {
  appointmentId: string;
  token: string;
  status: string;
  className?: string;
}

const JoinVideoButton: React.FC<JoinVideoButtonProps> = ({ 
  appointmentId, 
  token,
  status,
  className = ''
}) => {
  const router = useRouter();

  const handleJoinVideo = () => {
    router.push(`/appointments/join-meeting/${appointmentId}/${token}`);
  };

  return (
    <button
      onClick={handleJoinVideo}
      className={`px-3 py-1.5 bg-pink-500 text-white rounded-full hover:bg-[#4A154D] hover:text-white transition-colors text-sm ${className}`}
    >
      Join Video Consultation
    </button>
  );
};

export default JoinVideoButton; 