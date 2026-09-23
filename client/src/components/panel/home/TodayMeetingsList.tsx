import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import type { Meeting } from "@/features/meetings/types/meeting";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TodayMeetingsListProps {
  meetings: Meeting[];
  maxItems?: number;
  onJoinMeeting?: (meeting: Meeting) => void;
  onViewAll?: () => void;
}

export function TodayMeetingsList({
  meetings,
  maxItems = 3,
  onJoinMeeting,
  onViewAll,
}: TodayMeetingsListProps) {
  const navigate = useNavigate();
  const displayedMeetings = meetings.slice(0, maxItems);

  const handleJoin = (meeting: Meeting) => {
    if (onJoinMeeting) {
      onJoinMeeting(meeting);
    } else if (meeting.id) {
      navigate(`/meet/${meeting.id}`);
    } else {
      navigate("/livekit");
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/meetings");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3
          className="font-bold text-sm text-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Reuniones de hoy
        </h3>
        <Button
          type="button"
          variant="link"
          onClick={handleViewAll}
          className="text-xs p-0 h-auto text-primary hover:text-primary/80 transition-colors cursor-pointer font-medium"
        >
          Ver todas
        </Button>
      </div>

      {meetings.length === 0 ? (
        <Card className="p-8 border-border bg-card/60 rounded-2xl text-center space-y-2">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center mx-auto text-muted-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <p
            className="text-xs font-semibold text-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            No hay más reuniones para hoy
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            Todas tus reuniones programadas para hoy se mostrarán en esta lista interactiva.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayedMeetings.map((m, idx) => {
            const isLive = m.status === "IN_PROGRESS" || m.status === "live";
            const displayTitle = m.title || m.name || "Reunión programada";
            const displayTime = m.time || "10:00";
            const displayDuration = m.duration || "45 min";

            return (
              <div
                key={m.id || m.code || idx}
                style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                className="p-4 sm:p-5 border border-border/60 bg-card/90 rounded-2xl shadow-sm gap-4 sm:gap-6 hover:border-border transition-all group w-full"
              >
                {/* Hora y duración */}
                <div className="text-center min-w-[56px] shrink-0">
                  <p
                    className="text-base font-bold text-foreground tracking-tight"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {displayTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {displayDuration}
                  </p>
                </div>

                {/* Separador vertical */}
                <div className="w-px h-10 bg-border/60 shrink-0" />

                {/* Nombre de la reunión (sin participantes) */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm sm:text-base font-bold text-foreground truncate group-hover:text-primary transition-colors cursor-pointer text-left"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    onClick={() => handleJoin(m)}
                  >
                    {displayTitle}
                  </p>
                </div>

                {/* Acciones a la derecha: Badge y Botón */}
                <div
                  style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                  className="gap-3 shrink-0"
                >
                  <Badge
                    variant="outline"
                    className={
                      isLive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs px-3 py-1 rounded-full font-medium"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-3 py-1 rounded-full font-medium"
                    }
                  >
                    {isLive ? "En vivo" : "Próxima"}
                  </Badge>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleJoin(m)}
                    className="size-9 rounded-xl bg-white/[0.04] border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all cursor-pointer"
                    title="Unirse a la reunión"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TodayMeetingsList;
