import { useNavigate } from "react-router-dom";
import { MeetingsTable } from "../components";
import type { Screen } from "../types/meeting";

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

  return (
    <MeetingsTable
      onNav={handleNav}
      onCreateMeeting={() => (onNav ? onNav("create-meeting") : navigate("/meetings/create"))}
      onJoinMeeting={() => (onNav ? onNav("video-room") : navigate("/livekit"))}
      onEditMeeting={(meeting) => (onNav ? onNav("edit-meeting") : navigate(`/meetings/edit/${meeting.id}`))}
    />
  );
}

export { HistoryScreen };
