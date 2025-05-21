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

const VideoConsultation: React.FC<VideoConsultationProps> = ({ 
  appointmentId, 
  token 
}) => {
  const [agoraCredentials, setAgoraCredentials] = useState<AgoraCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const tracksRef = useRef<Array<ILocalAudioTrack | ILocalVideoTrack>>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://3.14.150.170:5000/api/appointments/join/${appointmentId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Agora credentials');
        }

        const data = await response.json();
        if (!data.agoraCredentials) {
          throw new Error('Invalid response format');
        }

        setAgoraCredentials(data.agoraCredentials);
      } catch (err) {
        console.error('Error fetching credentials:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize video call');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [appointmentId, token]);

  useEffect(() => {
    if (!agoraCredentials) return;

    const initAgora = async () => {
      try {
        // Initialize Agora client
        clientRef.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        // Set up event listeners
        const setupEventListeners = () => {
          if (!clientRef.current) return;

          clientRef.current.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            try {
              await clientRef.current?.subscribe(user, mediaType);

              if (mediaType === "video" && remotePlayerRef.current) {
                const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
                remoteVideoTrack.play(remotePlayerRef.current, { fit: "cover" });
              }

              if (mediaType === "audio") {
                const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
                remoteAudioTrack.play();
              }
            } catch (error) {
              console.error("Error handling user-published:", error);
            }
          });

          clientRef.current.on("user-unpublished", (user: IAgoraRTCRemoteUser) => {
            console.log("User left:", user.uid);
          });
        };

        setupEventListeners();

        // Join the channel
        await clientRef.current.join(
          agoraCredentials.appId,
          agoraCredentials.channel,
          agoraCredentials.token,
          agoraCredentials.uid
        );

        // Create and publish local tracks
        const [audioTrack, videoTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack()
        ]);
        
        tracksRef.current = [audioTrack, videoTrack];
        await clientRef.current.publish(tracksRef.current);

        // Display local video
        if (localPlayerRef.current) {
          videoTrack.play(localPlayerRef.current, { fit: "cover" });
        }

      } catch (error) {
        console.error("Agora initialization error:", error);
        setError("Failed to initialize video call");
      }
    };

    initAgora();

    return () => {
      // Clean up on unmount
      if (clientRef.current) {
        clientRef.current.leave();
      }
      tracksRef.current.forEach(track => {
        track?.stop();
        track?.close();
      });
    };
  }, [agoraCredentials]);

  const handleMute = () => {
    const audioTrack = tracksRef.current[0] as ILocalAudioTrack | undefined;
    if (audioTrack) {
      audioTrack.setEnabled(!audioTrack.enabled);
    }
  };

  const handleEndCall = () => {
    if (clientRef.current) {
      clientRef.current.leave();
    }
    tracksRef.current.forEach(track => {
      track?.stop();
      track?.close();
    });
  };

  if (isLoading) {
    return <div className="video-consultation-container">Initializing video call...</div>;
  }

  if (error) {
    return <div className="video-consultation-container">Error: {error}</div>;
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
        <button onClick={handleMute}>Mute</button>
        <button onClick={handleEndCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoConsultation;