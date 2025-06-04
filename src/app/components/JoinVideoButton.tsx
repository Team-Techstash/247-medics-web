'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaVideo } from 'react-icons/fa';

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
      title="Join Video Consultation"
      className={`rounded-full hover:text-pink-500 transition-colors text-sm ${className} flex items-center gap-2`}
    >
      <FaVideo className="text-xl" />
    </button>
  );
};

export default JoinVideoButton; 