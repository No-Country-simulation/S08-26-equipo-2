import { useEffect, useRef } from "react";

/** One attempt per meeting after server-confirmed admission. Failures use manual retry. */
export function useAutoJoinAfterApproval({ meetingId, enabled, isJoining, onJoin }: {
  meetingId?: string;
  enabled: boolean;
  isJoining: boolean;
  onJoin: () => void;
}) {
  const attemptedMeeting = useRef<string | null>(null);
  useEffect(() => {
    if (!meetingId || !enabled || isJoining || attemptedMeeting.current === meetingId) return;
    attemptedMeeting.current = meetingId;
    onJoin();
  }, [meetingId, enabled, isJoining, onJoin]);
}
