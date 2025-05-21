import React from 'react';
import VideoConsultation from '@/app/video-consultation/VideoConsultation';

interface PageProps {
  params: {
    appointmentId: string;
    token: string;
  };
}

const VideoConsultationPage: React.FC<PageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoConsultation 
        appointmentId={params.appointmentId}
        token={params.token}
      />
    </div>
  );
};

export default VideoConsultationPage; 