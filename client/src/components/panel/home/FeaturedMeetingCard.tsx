import { useNavigate } from "react-router-dom";
import { Play, Video, Calendar, Plus } from "lucide-react";
import type { Meeting } from "@/features/meetings/types/meeting";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturedMeetingCardProps {
  meeting: Meeting | null;
  onJoinMeeting?: (meeting: Meeting) => void;
  onCreateMeeting?: () => void;
}

export function FeaturedMeetingCard({
  meeting,
  onJoinMeeting,
  onCreateMeeting,
}: FeaturedMeetingCardProps) {
  const navigate = useNavigate();

  if (!meeting) {
    return (
      <Card
        className="p-6 h-full flex flex-col justify-between relative overflow-hidden border-border rounded-2xl shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(13,23,48,0.95))",
        }}
      >
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <h3
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Sin reuniones pendientes
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No tienes reuniones en vivo ni pendientes para el día de hoy. Puedes
            programar una nueva sesión o invitar a tu equipo.
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            onClick={
              onCreateMeeting ? onCreateMeeting : () => navigate("/meetings/create")
            }
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm cursor-pointer shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Programar reunión
          </Button>
        </div>
      </Card>
    );
  }

  const isLive = meeting.status === "IN_PROGRESS" || meeting.status === "live";
  const displayTitle = meeting.title || meeting.name || "Reunión";
  const displayDuration = meeting.duration || "45 min";

  const participantsCount = Array.isArray(meeting.participants)
    ? meeting.participants.length
    : typeof meeting.participants === "number"
    ? meeting.participants
    : 0;

  // Generar etiquetas de avatares con datos reales (o lista vacía si no hay participantes)
  const avatarList =
    Array.isArray(meeting.participants) && meeting.participants.length > 0
      ? meeting.participants.slice(0, 4).map((p, i) => {
          if (typeof p === "object" && p !== null) {
            const userObj = (p as any).user || p;
            const name =
              userObj.fullName || userObj.name || userObj.email || `P${i + 1}`;
            const initials =
              name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part: string) => part[0])
                .join("")
                .toUpperCase() || name.slice(0, 2).toUpperCase();
            return {
              initials,
              avatarUrl: userObj.avatarUrl || null,
              name,
            };
          }
          return {
            initials: `P${i + 1}`,
            avatarUrl: null,
            name: `Participante ${i + 1}`,
          };
        })
      : [];

  const remainingCount =
    participantsCount > avatarList.length
      ? participantsCount - avatarList.length
      : 0;

  const handleJoin = () => {
    if (onJoinMeeting) {
      onJoinMeeting(meeting);
    } else if (meeting.id) {
      navigate(`/meet/${meeting.id}`);
    } else {
      navigate("/livekit");
    }
  };

  return (
    <Card
      className="p-5 h-full relative overflow-hidden border-border rounded-2xl shadow-xl flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(13,23,48,0.96))",
      }}
    >
      {/* Destello radial decorativo */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={
              isLive
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5"
                : "bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs px-2.5 py-0.5"
            }
          >
            {isLive ? "En vivo" : "Próxima"}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            {isLive ? "Ahora" : meeting.time || "Hoy"}
          </span>
        </div>

        <div>
          <h3
            className="text-lg font-bold text-foreground leading-snug line-clamp-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {displayTitle}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {displayDuration} ·{" "}
            {participantsCount === 0
              ? "0 participantes"
              : participantsCount === 1
              ? "1 participante"
              : `${participantsCount} participantes`}
          </p>
        </div>

        {/* Avatares reales solo si hay participantes */}
        {avatarList.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {avatarList.map((item, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card shadow-sm text-white shrink-0 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                }}
                title={item.name}
              >
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  item.initials
                )}
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card shadow-sm text-white bg-slate-700/80 shrink-0"
                title={`${remainingCount} más`}
              >
                +{remainingCount}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 pt-5">
        <Button
          type="button"
          onClick={handleJoin}
          className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm cursor-pointer shadow-lg shadow-primary/20"
        >
          {isLive ? <Play className="w-4 h-4 fill-current" /> : <Video className="w-4 h-4" />}
          {isLive ? "Unirse ahora" : "Entrar a la reunión"}
        </Button>
      </div>
    </Card>
  );
}

export default FeaturedMeetingCard;
