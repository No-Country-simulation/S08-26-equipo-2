import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Meeting } from "../types/meeting";

export interface UseMeetingTimerOptions {
  meeting?: Meeting | null;
  warningMinutes?: number;
  onExpire?: () => void;
  enabled?: boolean;
}

export interface UseMeetingTimerResult {
  timeRemainingMs: number;
  formattedRemaining: string;
  isWarningActive: boolean;
  isLastMinute: boolean;
  isExpired: boolean;
  warningMinutes: number;
  dismissWarning: () => void;
  isWarningDismissed: boolean;
  totalDurationMinutes: number;
}

function formatRemainingTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function useMeetingTimer({
  meeting,
  warningMinutes = 5,
  onExpire,
  enabled = true,
}: UseMeetingTimerOptions): UseMeetingTimerResult {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const hasExpiredRef = useRef(false);
  const mountTimeRef = useRef(Date.now());

  const totalDurationMinutes = useMemo(() => {
    if (meeting?.estimatedDurationMinutes && meeting.estimatedDurationMinutes > 0) {
      return meeting.estimatedDurationMinutes;
    }
    return 45;
  }, [meeting?.estimatedDurationMinutes]);

  // Si la duración total es corta (ej <= 10 min), ajustar warningMinutes a 2 min
  const effectiveWarningMinutes = useMemo(() => {
    if (totalDurationMinutes <= 10) {
      return Math.min(2, Math.floor(totalDurationMinutes / 2));
    }
    return warningMinutes;
  }, [totalDurationMinutes, warningMinutes]);

  // Determinar timestamp de inicio de la reunión
  const startTimestamp = useMemo(() => {
    const rawStart = meeting?.actualStartAt || meeting?.scheduledStartAt;
    if (rawStart) {
      const parsed = new Date(rawStart).getTime();
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return mountTimeRef.current;
  }, [meeting?.actualStartAt, meeting?.scheduledStartAt]);

  const endTimestamp = useMemo(() => {
    return startTimestamp + totalDurationMinutes * 60 * 1000;
  }, [startTimestamp, totalDurationMinutes]);

  const timeRemainingMs = useMemo(() => {
    if (!enabled) return totalDurationMinutes * 60 * 1000;
    return Math.max(0, endTimestamp - currentTime);
  }, [enabled, endTimestamp, currentTime, totalDurationMinutes]);

  const isExpired = timeRemainingMs <= 0;
  const isLastMinute = timeRemainingMs <= 60 * 1000 && timeRemainingMs > 0;
  const isWarningActive =
    !warningDismissed &&
    timeRemainingMs <= effectiveWarningMinutes * 60 * 1000 &&
    timeRemainingMs > 0;

  // Intervalo de actualización de reloj cada segundo
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  // Disparar onExpire una sola vez al terminar el tiempo
  useEffect(() => {
    if (!enabled) return;

    if (isExpired && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpire?.();
    }
  }, [enabled, isExpired, onExpire]);

  const dismissWarning = useCallback(() => {
    setWarningDismissed(true);
  }, []);

  return {
    timeRemainingMs,
    formattedRemaining: formatRemainingTime(timeRemainingMs),
    isWarningActive,
    isLastMinute,
    isExpired,
    warningMinutes: effectiveWarningMinutes,
    dismissWarning,
    isWarningDismissed: warningDismissed,
    totalDurationMinutes,
  };
}
