'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaVideo } from 'react-icons/fa';

interface JoinVideoButtonProps {
  meetingCode: string;
  status: string;
  className?: string;
}

const JoinVideoButton: React.FC<JoinVideoButtonProps> = ({ 
  meetingCode,
  status,
  className = ''
}) => {
  const router = useRouter();

  const handleJoinVideo = () => {
    router.push(`/meeting/${meetingCode}`);
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