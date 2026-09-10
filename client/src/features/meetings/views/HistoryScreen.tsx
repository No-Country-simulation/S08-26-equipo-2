import { MeetingsTable } from "../components";
import type { Screen } from "../types/meeting";

export interface HistoryScreenProps {
  onNav?: (screen: Screen) => void;
}

export default function HistoryScreen({ onNav }: HistoryScreenProps) {
  return <MeetingsTable onNav={onNav} />;
}

export { HistoryScreen };
