import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaSettingsStore } from "../stores";

export interface MediaDeviceInfoOption {
  value: string;
  label: string;
}

export function useMediaDevices() {
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [microphones, setMicrophones] = useState<MediaDeviceInfoOption[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfoOption[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfoOption[]>([]);

  // Persistent state managed by Zustand
  const {
    selectedMic,
    setSelectedMic,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedCamera,
    setSelectedCamera,
    isCameraActive,
    setIsCameraActive,
    isMicActive,
    setIsMicActive,
    toggleCamera,
    toggleMic,
  } = useMediaSettingsStore();

  // Volatile runtime stream and testing states
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Enumerate devices helper
  const enumerateDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices
        .filter((d) => d.kind === "audioinput")
        .map((d, index) => ({
          value: d.deviceId || `mic-${index}`,
          label: d.label || `Micrófono ${index + 1}`,
        }));

      const audioOutputs = devices
        .filter((d) => d.kind === "audiooutput")
        .map((d, index) => ({
          value: d.deviceId || `speaker-${index}`,
          label: d.label || `Altavoz ${index + 1}`,
        }));

      const videoInputs = devices
        .filter((d) => d.kind === "videoinput")
        .map((d, index) => ({
          value: d.deviceId || `cam-${index}`,
          label: d.label || `Cámara ${index + 1}`,
        }));

      setMicrophones(audioInputs);
      setCameras(videoInputs);
      setSpeakers(
        audioOutputs.length > 0
          ? audioOutputs
          : [{ value: "default", label: "Altavoces del sistema (predeterminado)" }]
      );

      // Verify and restore persistent selection or fallback to first available
      const currentStoreState = useMediaSettingsStore.getState();

      if (audioInputs.length > 0) {
        const micExists = audioInputs.some((m) => m.value === currentStoreState.selectedMic);
        if (!currentStoreState.selectedMic || !micExists) {
          setSelectedMic(audioInputs[0].value);
        }
      }

      if (videoInputs.length > 0) {
        const camExists = videoInputs.some((c) => c.value === currentStoreState.selectedCamera);
        if (!currentStoreState.selectedCamera || !camExists) {
          setSelectedCamera(videoInputs[0].value);
        }
      }

      if (audioOutputs.length > 0) {
        const speakerExists = audioOutputs.some((s) => s.value === currentStoreState.selectedSpeaker);
        if (!currentStoreState.selectedSpeaker || !speakerExists) {
          setSelectedSpeaker(audioOutputs[0].value);
        }
      } else if (!currentStoreState.selectedSpeaker) {
        setSelectedSpeaker("default");
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  }, [setSelectedMic, setSelectedCamera, setSelectedSpeaker]);

  // Request permissions and start streams
  const requestPermissions = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("denied");
      setErrorMessage("Tu navegador no soporta el acceso a dispositivos multimedia.");
      return;
    }

    setPermissionState("requesting");
    setErrorMessage(null);

    try {
      // First request both or fallback gracefully
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch {
        // Try audio-only or video-only if user does not have camera or mic
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      // Stop initial discovery tracks
      stream.getTracks().forEach((track) => track.stop());

      setPermissionState("granted");
      await enumerateDevices();
    } catch (err) {
      console.warn("Permissions denied or devices unavailable:", err);
      setPermissionState("denied");
      setErrorMessage(
        "No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar los permisos en el navegador."
      );
    }
  }, [enumerateDevices]);

  // Handle Video Stream
  useEffect(() => {
    if (permissionState !== "granted" || !isCameraActive) {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
        videoStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      return;
    }

    let isMounted = true;

    async function startVideo() {
      try {
        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        videoStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Could not start video stream with selected device:", err);
      }
    }

    startVideo();

    return () => {
      isMounted = false;
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
        videoStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [permissionState, selectedCamera, isCameraActive]);

  // Handle Audio Stream & Volume Analysis
  useEffect(() => {
    if (permissionState !== "granted" || !isMicActive) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setAudioLevel(0);
      return;
    }

    let isMounted = true;

    async function startAudio() {
      try {
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          await audioContextRef.current.close().catch(() => {});
        }

        const constraints: MediaStreamConstraints = {
          audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        audioStreamRef.current = stream;

        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.4;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          if (!isMounted) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Normalizing: avg usually hovers around 0-80 for speaking voice
          const calculatedLevel = Math.min(100, Math.round((avg / 65) * 100));
          setAudioLevel(calculatedLevel);
          animFrameRef.current = requestAnimationFrame(tick);
        };

        tick();
      } catch (err) {
        console.warn("Could not start audio meter with selected device:", err);
      }
    }

    startAudio();

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setAudioLevel(0);
    };
  }, [permissionState, selectedMic, isMicActive]);

  // Initial trigger
  useEffect(() => {
    requestPermissions();

    const handleDeviceChange = () => {
      enumerateDevices();
    };

    navigator.mediaDevices?.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [requestPermissions, enumerateDevices]);

  // Speaker Test Tone
  const playTestSound = useCallback(async () => {
    if (isPlayingTestSound) return;
    setIsPlayingTestSound(true);

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();

      // Chord frequencies: C5, E5, G5
      const notes = [523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.65);
      });

      setTimeout(() => {
        ctx.close().catch(() => {});
        setIsPlayingTestSound(false);
      }, 1000);
    } catch (err) {
      console.error("Error playing test sound:", err);
      setIsPlayingTestSound(false);
    }
  }, [isPlayingTestSound]);

  return {
    permissionState,
    errorMessage,
    requestPermissions,
    microphones,
    speakers,
    cameras,
    selectedMic,
    setSelectedMic,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedCamera,
    setSelectedCamera,
    audioLevel,
    isCameraActive,
    setIsCameraActive,
    isMicActive,
    setIsMicActive,
    toggleCamera,
    toggleMic,
    videoRef,
    playTestSound,
    isPlayingTestSound,
  };
}
