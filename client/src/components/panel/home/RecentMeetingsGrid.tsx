import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Users, Video } from "lucide-react";
import type { HistoryMeetingUI } from "@/features/history/types/history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentMeetingsGridProps {
  meetings: HistoryMeetingUI[];
  onViewHistory?: () => void;
}

export function RecentMeetingsGrid({
  meetings,
  onViewHistory,
}: RecentMeetingsGridProps) {
  const navigate = useNavigate();

  const handleHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    } else {
      navigate("/history");
    }
  };

  const displayedMeetings = meetings.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3
          className="font-bold text-sm text-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Reuniones recientes
        </h3>
        <Button
          type="button"
          variant="link"
          onClick={handleHistory}
          className="text-xs p-0 h-auto text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer font-medium"
        >
          Ver historial <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {displayedMeetings.length === 0 ? (
        <Card className="p-6 border-border bg-card/60 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            Aún no tienes reuniones concluidas en tu historial.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedMeetings.map((m, idx) => {
            const displayTitle = m.title || m.code || "Reunión finalizada";
            const displayDate = m.date || "Reciente";
            const duration = m.durationLabel || "45 min";
            const participantsCount = Array.isArray(m.participants)
              ? m.participants.length
              : typeof m.participants === "number"
              ? m.participants
              : 0;

            return (
              <Card
                key={m.id || m.code || idx}
                onClick={handleHistory}
                className="p-4 border-border bg-card rounded-xl shadow-sm group cursor-pointer hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4
                    className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {displayTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {displayDate}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                    {duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-muted-foreground/70" />
                    {participantsCount}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentMeetingsGrid;
