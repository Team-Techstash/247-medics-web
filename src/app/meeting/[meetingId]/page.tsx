import React from 'react';
import VideoConsultation from '@/app/video-consultation/VideoConsultation';

interface PageProps {
  params: {
    meetingId: string;
  };
}

const MeetingPage: React.FC<PageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoConsultation 
        meetingCode={params.meetingId}
      />
    </div>
  );
};

export default MeetingPage; 