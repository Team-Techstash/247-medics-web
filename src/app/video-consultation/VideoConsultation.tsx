import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useRouter } from "next/navigation";
import "./VideoConsultation.css";

interface VideoConsultationProps {
  appointmentId?: string;
}

interface AgoraCredentials {
  token: string;
  channel: string;
  appId: string;
  uid: string;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ appointmentId }) => {
  const router = useRouter();
  const [agoraCredentials, setAgoraCredentials] = useState<AgoraCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const tracksRef = useRef<any[]>([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const cleanup = async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.leave();
      }
      tracksRef.current.forEach(track => {
        track.stop();
        track.close();
      });
      tracksRef.current = [];
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://3.14.150.170:5000/api/appointments/join/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to get video consultation credentials');
      }

      const data = await response.json();
      setAgoraCredentials(data.agoraCredentials);
      reconnectAttemptsRef.current = 0;
    } catch (error) {
      console.error('Error fetching credentials:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize video consultation');
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (appointmentId) {
      fetchCredentials();
    }

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [appointmentId]);

  const handleReconnect = async () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setError('Maximum reconnection attempts reached. Please refresh the page.');
      return;
    }

    setIsReconnecting(true);
    reconnectAttemptsRef.current += 1;

    try {
      await cleanup();
      await fetchCredentials();
    } catch (error) {
      console.error('Reconnection error:', error);
      setError('Failed to reconnect. Please try again.');
    } finally {
      setIsReconnecting(false);
    }
  };

  useEffect(() => {
    if (!agoraCredentials) return;

    const initAgora = async () => {
      try {
        clientRef.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        setupEventListeners();

        if (
          !agoraCredentials.appId ||
          !agoraCredentials.channel ||
          !agoraCredentials.token ||
          !agoraCredentials.uid
        ) {
          setError('Missing video credentials. Please try again later.');
          return;
        }

        await clientRef.current.join(
          agoraCredentials.appId,
          agoraCredentials.channel,
          agoraCredentials.token,
          agoraCredentials.uid
        );

        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        
        tracksRef.current = [localAudioTrack, localVideoTrack];
        
        await clientRef.current.publish(tracksRef.current);

        if (localPlayerRef.current) {
          localVideoTrack.play(localPlayerRef.current, { fit: "cover" });
        }

      } catch (error) {
        console.error("Agora initialization error:", error);
        if (error instanceof Error && error.message.includes('token')) {
          setError('Session expired. Please refresh the page.');
        } else {
          setError('Failed to initialize video consultation');
        }
      }
    };

    const setupEventListeners = () => {
      clientRef.current.on("user-published", async (user: any, mediaType: string) => {
        try {
          await clientRef.current.subscribe(user, mediaType);

          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            if (remotePlayerRef.current) {
              remoteVideoTrack.play(remotePlayerRef.current, { fit: "cover" });
            }
          }

          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
          }
        } catch (error) {
          console.error('Error handling user-published event:', error);
        }
      });

      clientRef.current.on("user-unpublished", (user: any) => {
        console.log("User left:", user.uid);
      });

      clientRef.current.on("connection-state-change", (curState: string, prevState: string) => {
        console.log('Connection state changed:', prevState, 'to', curState);
        if (curState === 'DISCONNECTED') {
          handleReconnect();
        }
      });
    };

    initAgora();

    return () => {
      cleanup();
    };
  }, [agoraCredentials]);

  const handleMute = () => {
    if (tracksRef.current[0]) {
      const audioTrack = tracksRef.current[0];
      audioTrack.setEnabled(!audioTrack.enabled);
      setIsMuted(!audioTrack.enabled);
    }
  };

  const handleVideoToggle = () => {
    if (tracksRef.current[1]) {
      const videoTrack = tracksRef.current[1];
      videoTrack.setEnabled(!videoTrack.enabled);
      setIsVideoEnabled(!videoTrack.enabled);
    }
  };

  const handleEndCall = async () => {
    try {
      await cleanup();
      router.push('/appointments');
    } catch (error) {
      console.error('Error ending call:', error);
      router.push('/appointments');
    }
  };

  if (error) {
    return (
      <div className="video-consultation-container flex items-center justify-center">
        <div className="text-red-500">
          {error}
          {error.includes('Session expired') && (
            <button 
              onClick={() => window.location.reload()}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh Page
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!agoraCredentials) {
    return (
      <div className="video-consultation-container flex items-center justify-center">
        <div className="text-gray-500">
          {isReconnecting ? 'Reconnecting...' : 'Initializing video consultation...'}
        </div>
      </div>
    );
  }

  return (
    <div className="video-consultation-container">
      <div className="video-grid">
        <div 
          ref={localPlayerRef} 
          className="video-player local-video"
          style={{ width: "200px", height: "150px" }}
        ></div>
        <div 
          ref={remotePlayerRef} 
          className="video-player remote-video"
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>
      <div className="consultation-controls">
        <button 
          onClick={handleMute}
          className={`control-button ${isMuted ? 'active' : ''}`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button 
          onClick={handleVideoToggle}
          className={`control-button ${!isVideoEnabled ? 'active' : ''}`}
        >
          {isVideoEnabled ? 'Close Video' : 'Open Video'}
        </button>
        <button 
          onClick={handleEndCall}
          className="control-button end-call"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoConsultation; 