import { useNavigate } from "react-router-dom";
import { MeetingsTable } from "../components";
import type { Screen, Meeting } from "../types/meeting";

export interface HistoryScreenProps {
  onNav?: (screen: Screen) => void;
}

export default function HistoryScreen({ onNav }: HistoryScreenProps) {
  const navigate = useNavigate();

  const handleNav = (screen: Screen) => {
    if (onNav) {
      onNav(screen);
      return;
    }
    if (screen === "create-meeting") {
      navigate("/meetings/create");
    } else if (screen === "video-room") {
      navigate("/livekit");
    } else if (screen === "history" || screen === "dashboard") {
      navigate("/meetings");
    }
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (meeting.id) {
      navigate(`/meet/${meeting.id}`);
    } else if (onNav) {
      onNav("video-room");
    } else {
      navigate("/livekit");
    }
  };

  return (
    <MeetingsTable
      title="Agenda de reuniones"
      onNav={handleNav}
      onCreateMeeting={() => (onNav ? onNav("create-meeting") : navigate("/meetings/create"))}
      onJoinMeeting={handleJoinMeeting}
      onEditMeeting={(meeting) => (onNav ? onNav("edit-meeting") : navigate(`/meetings/edit/${meeting.id}`))}
    />
  );
}

export { HistoryScreen };
