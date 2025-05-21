'use client';

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, { 
  IAgoraRTCClient, 
  ILocalAudioTrack, 
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from "agora-rtc-sdk-ng";
import { useRouter } from "next/navigation";
import "./VideoConsultation.css";

interface AgoraCredentials {
  appId: string;
  channel: string;
  token: string;
  uid: string | number;
}

interface VideoConsultationProps {
  appointmentId: string;
  token: string;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ appointmentId, token }) => {
  const router = useRouter();
  const [agoraCredentials, setAgoraCredentials] = useState<AgoraCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const isInitializedRef = useRef(false);

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const tracksRef = useRef<Array<ILocalAudioTrack | ILocalVideoTrack>>([]);

  const cleanup = async () => {
    try {
      // Stop and close all tracks first
      tracksRef.current.forEach(track => {
        if (track) {
          track.stop();
          track.close();
        }
      });
      tracksRef.current = [];

      // Only attempt to leave if client exists and is connected
      if (clientRef.current && connectionState !== 'DISCONNECTED') {
        try {
          await clientRef.current.leave();
        } catch (leaveError) {
          console.warn('Leave error during cleanup:', leaveError);
          // Continue with cleanup even if leave fails
        }
      }
      clientRef.current = null;
      isInitializedRef.current = false;
      setConnectionState('DISCONNECTED');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const handleReconnect = async () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setError('Maximum reconnection attempts reached');
      return;
    }

    setIsReconnecting(true);
    reconnectAttemptsRef.current += 1;

    try {
      // Wait for cleanup to complete
      await cleanup();
      
      // Add a longer delay before reconnecting
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fetch new credentials before attempting to reconnect
      await fetchCredentials();
    } catch (error) {
      console.error('Reconnection failed:', error);
      setError('Failed to reconnect');
    } finally {
      setIsReconnecting(false);
    }
  };

  const setupEventListeners = (client: IAgoraRTCClient) => {
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === "video" && remotePlayerRef.current) {
          const videoTrack = user.videoTrack as IRemoteVideoTrack;
          videoTrack.play(remotePlayerRef.current, { fit: "cover" });
        } else if (mediaType === "audio") {
          const audioTrack = user.audioTrack as IRemoteAudioTrack;
          audioTrack.play();
        }
      } catch (error) {
        console.error('Error handling user-published event:', error);
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      console.log("User left:", user.uid);
    };

    const handleConnectionStateChange = (curState: string) => {
      setConnectionState(curState);
      
      if (curState === 'DISCONNECTED' && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        handleReconnect();
      }
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("connection-state-change", handleConnectionStateChange);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("connection-state-change", handleConnectionStateChange);
    };
  };

  const fetchCredentials = async () => {
    try {
      const response = await fetch(`http://3.14.150.170:5000/api/appointments/join/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Agora credentials');
      }
      
      const data = await response.json();
      if (!data.success || !data.agoraCredentials) {
        throw new Error('Invalid response format from server');
      }
      
      setAgoraCredentials(data.agoraCredentials);
    } catch (error) {
      console.error('Error fetching Agora credentials:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch credentials');
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [appointmentId, token]);

  useEffect(() => {
    if (!agoraCredentials || isInitializedRef.current) return;

    let cleanupEventListeners: () => void;
    const initAgora = async () => {
      try {
        // Ensure proper cleanup before initialization
        await cleanup();
        
        // Add a delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;
        
        cleanupEventListeners = setupEventListeners(client);

        if (!agoraCredentials.appId || !agoraCredentials.channel || !agoraCredentials.token) {
          throw new Error('Invalid Agora credentials');
        }

        // Validate token before joining
        if (agoraCredentials.token.length < 10) {
          throw new Error('Invalid token format');
        }

        let uid: string | number;
        const currentUid = agoraCredentials.uid;
        
        if (typeof currentUid === 'string') {
          if (currentUid.length > 0 && currentUid.length <= 255) {
            uid = currentUid;
          } else {
            uid = Math.abs(currentUid.split('').reduce((acc, char) => {
              return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0)) % 10000;
          }
        } else {
          uid = Math.min(Math.max(Number(currentUid), 0), 10000);
        }

        // Join with error handling and retry logic
        let joinAttempts = 0;
        const maxJoinAttempts = 3;
        
        while (joinAttempts < maxJoinAttempts) {
          try {
            await client.join(
              agoraCredentials.appId,
              agoraCredentials.channel,
              agoraCredentials.token,
              uid
            );
            break; // If join succeeds, break the loop
          } catch (joinError) {
            joinAttempts++;
            console.error(`Join attempt ${joinAttempts} failed:`, joinError);
            
            if (joinAttempts === maxJoinAttempts) {
              throw new Error('Failed to join the channel after multiple attempts. Please check your credentials and try again.');
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        // Create tracks with error handling
        let audioTrack, videoTrack;
        try {
          [audioTrack, videoTrack] = await Promise.all([
            AgoraRTC.createMicrophoneAudioTrack(),
            AgoraRTC.createCameraVideoTrack()
          ]);
        } catch (trackError) {
          console.error('Track creation error:', trackError);
          throw new Error('Failed to access camera or microphone. Please check your device permissions.');
        }
        
        tracksRef.current = [audioTrack, videoTrack];
        
        // Publish tracks with error handling
        try {
          await client.publish([audioTrack, videoTrack]);
        } catch (publishError) {
          console.error('Publish error:', publishError);
          throw new Error('Failed to publish media tracks. Please try again.');
        }

        if (localPlayerRef.current) {
          videoTrack.play(localPlayerRef.current, { fit: "cover" });
        }

        isInitializedRef.current = true;
        setConnectionState('CONNECTED');
      } catch (error) {
        console.error("Agora initialization error:", error);
        setError(error instanceof Error ? error.message : 'Failed to initialize video');
        await cleanup();
      }
    };

    initAgora();

    return () => {
      cleanupEventListeners?.();
      cleanup();
    };
  }, [agoraCredentials]);

  const handleMute = () => {
    const audioTrack = tracksRef.current.find(track => 'setEnabled' in track && track.trackMediaType === 'audio') as ILocalAudioTrack;
    if (audioTrack) {
      audioTrack.setEnabled(!audioTrack.enabled);
    }
  };

  const handleEndCall = async () => {
    await cleanup();
    router.push('/appointments');
  };

  return (
    <div className="video-consultation-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleReconnect}>Retry</button>
        </div>
      )}
      
      {isReconnecting && (
        <div className="reconnecting-message">
          Reconnecting...
        </div>
      )}

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
        <button onClick={handleMute}>Mute</button>
        <button onClick={handleEndCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoConsultation;