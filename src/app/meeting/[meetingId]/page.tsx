import React from 'react';
import VideoConsultation from '@/app/video-consultation/VideoConsultation';

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

const MeetingPage: React.FC<PageProps> = async ({ params }) => {
  const { meetingId } = await params;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoConsultation 
        meetingCode={meetingId}
      />
    </div>
  );
};

export default MeetingPage;