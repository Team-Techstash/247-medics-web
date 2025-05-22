"use client";

import React, { useEffect, useRef, useState } from "react";
import "./VideoConsultation.css";

// Import types only
import type {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

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
  token,
}) => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [agoraCredentials, setAgoraCredentials] = useState<AgoraCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agoraRTC, setAgoraRTC] = useState<any>(null);

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<[ILocalAudioTrack, ILocalVideoTrack] | null>(null);

  // Initialize AgoraRTC on client side only
  useEffect(() => {
    const initAgora = async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        setAgoraRTC(AgoraRTC);
      } catch (err) {
        console.error('Failed to load AgoraRTC:', err);
        setError('Failed to initialize video call system');
      }
    };
    initAgora();
  }, []);

  // Step 1: Check for permissions
  useEffect(() => {
    if (!agoraRTC) return;

    const checkPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setPermissionsGranted(true);
      } catch (err) {
        console.warn("Permissions denied or not available:", err);
        setPermissionsGranted(false);
        setIsLoading(false);
        setError("Please allow camera and microphone permissions to join the video call.");
      }
    };

    checkPermissions();
  }, [agoraRTC]);

  // Step 2: Fetch credentials only if permissions are granted
  useEffect(() => {
    if (!permissionsGranted || !agoraRTC) return;

    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
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
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Agora credentials");
        }

        if (!data.agoraCredentials) {
          throw new Error("Invalid response format");
        }

        setAgoraCredentials(data.agoraCredentials);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch credentials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [permissionsGranted, appointmentId, token, agoraRTC]);

  // Step 3: Start Agora client only if credentials exist
  useEffect(() => {
    if (!agoraCredentials || !agoraRTC) return;

    const startCall = async () => {
      try {
        clientRef.current = agoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        clientRef.current.on(
          "user-published",
          async (user: IAgoraRTCRemoteUser, mediaType) => {
            await clientRef.current?.subscribe(user, mediaType);
            if (mediaType === "video" && remotePlayerRef.current) {
              user.videoTrack?.play(remotePlayerRef.current);
            }
            if (mediaType === "audio") {
              user.audioTrack?.play();
            }
          }
        );

        clientRef.current.on("user-unpublished", (user) => {
          console.log("Remote user unpublished:", user.uid);
        });

        await clientRef.current.join(
          agoraCredentials.appId,
          agoraCredentials.channel,
          agoraCredentials.token,
          agoraCredentials.uid
        );

        const [audioTrack, videoTrack] = await Promise.all([
          agoraRTC.createMicrophoneAudioTrack(),
          agoraRTC.createCameraVideoTrack(),
        ]);

        localTracksRef.current = [audioTrack, videoTrack];

        await clientRef.current.publish([audioTrack, videoTrack]);

        if (localPlayerRef.current) {
          videoTrack.play(localPlayerRef.current);
        }
      } catch (err) {
        console.error("Agora initialization error:", err);
        setError("Failed to join the video call.");
      }
    };

    startCall();

    return () => {
      const cleanup = async () => {
        if (clientRef.current) {
          await clientRef.current.leave();
          clientRef.current.removeAllListeners();
        }
        if (localTracksRef.current) {
          localTracksRef.current.forEach((track) => {
            track.stop();
            track.close();
          });
        }
        localTracksRef.current = null;
      };
      cleanup();
    };
  }, [agoraCredentials, agoraRTC]);

  const handleMute = () => {
    const audioTrack = localTracksRef.current?.[0];
    if (audioTrack) {
      const newState = !audioTrack.enabled;
      audioTrack.setEnabled(newState);
    }
  };

  const handleEndCall = async () => {
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    if (localTracksRef.current) {
      localTracksRef.current.forEach((track) => {
        track.stop();
        track.close();
      });
    }
    localTracksRef.current = null;
  };

  // Step 4: Render
  if (isLoading) {
    return (
      <div className="video-consultation-container center-message">
        Initializing video call.
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="video-consultation-container">
      <div className="video-grid">
        <div ref={localPlayerRef} className="video-player local-video"></div>
        <div ref={remotePlayerRef} className="video-player remote-video"></div>
      </div>
      <div className="consultation-controls">
        <button onClick={handleMute}>Mute</button>
        <button onClick={handleEndCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoConsultation;
