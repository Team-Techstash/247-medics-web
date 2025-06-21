import React from 'react';
import VideoConsultation from '@/app/video-consultation/VideoConsultation';

interface PageProps {
  // ANY-PROPS-NOTE
  params: any;
}

const VideoConsultationPage: React.FC<PageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <VideoConsultation 
        meetingCode={params.meetingCode}
      />
    </div>
  );
};

export default VideoConsultationPage; 