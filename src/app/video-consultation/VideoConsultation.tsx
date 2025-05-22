"use client";

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
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
  token,
}) => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(
    null
  );
  const [agoraCredentials, setAgoraCredentials] =
    useState<AgoraCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<[ILocalAudioTrack, ILocalVideoTrack] | null>(
    null
  );

  // Step 1: Check for permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setPermissionsGranted(true);
      } catch (err) {
        console.warn("Permissions denied or not available:", err);
        setPermissionsGranted(false);
        setIsLoading(false);
        setError(
          "Please allow camera and microphone permissions to join the video call."
        );
      }
    };

    checkPermissions();
  }, []);

  // Step 2: Fetch credentials only if permissions are granted
  useEffect(() => {
    if (!permissionsGranted) return;

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

        if (!response.ok) throw new Error("Failed to fetch Agora credentials");

        const data = await response.json();
        if (!data.agoraCredentials) throw new Error("Invalid response format");

        setAgoraCredentials(data.agoraCredentials);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch credentials"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [permissionsGranted, appointmentId, token]);

  // Step 3: Start Agora client only if credentials exist
  useEffect(() => {
    if (!agoraCredentials) return;

    const startCall = async () => {
      try {
        clientRef.current = AgoraRTC.createClient({
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
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack(),
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
  }, [agoraCredentials]);

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
    return (
      <div className="error-message">{error}</div>
    );
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
