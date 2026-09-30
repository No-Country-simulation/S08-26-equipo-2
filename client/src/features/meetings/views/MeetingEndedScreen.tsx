import { useNavigate } from "react-router-dom";
import { Clock, Users, Calendar, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Meeting, Screen } from "../types/meeting";
import { cn } from "@/lib/utils";

export interface MeetingEndedScreenProps {
  meeting?: Meeting | null;
  onNav?: (screen: Screen) => void;
  className?: string;
}

function calculateMeetingDuration(meeting?: Meeting | null): string {
  if (!meeting) return "45 min";
  if (meeting.duration && meeting.duration.trim()) return meeting.duration;

  const startIso = meeting.actualStartAt || meeting.scheduledStartAt;
  const endIso = meeting.actualEndAt || new Date().toISOString();

  if (startIso && endIso) {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      const minutes = Math.max(1, Math.round((end - start) / 60000));
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const remaining = minutes % 60;
      return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`;
    }
  }

  if (meeting.estimatedDurationMinutes && meeting.estimatedDurationMinutes > 0) {
    return `${meeting.estimatedDurationMinutes} min`;
  }

  return "45 min";
}

function formatMeetingDateLabel(meeting?: Meeting | null): string {
  const referenceDate = meeting?.actualStartAt || meeting?.scheduledStartAt || new Date().toISOString();
  try {
    const d = new Date(referenceDate);
    if (isNaN(d.getTime())) return "Hoy";
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "Hoy";
  }
}

export function MeetingEndedScreen({
  meeting,
  onNav,
  className,
}: MeetingEndedScreenProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onNav) {
      onNav("dashboard");
    } else {
      navigate("/");
    }
  };

  const handleGoHistory = () => {
    if (onNav) {
      onNav("history");
    } else {
      navigate("/history");
    }
  };

  const durationLabel = calculateMeetingDuration(meeting);
  const dateLabel = formatMeetingDateLabel(meeting);

  const participantsCount = Array.isArray(meeting?.participants)
    ? meeting.participants.length
    : typeof meeting?.participants === "number"
    ? meeting.participants
    : 1;

  const meetingTitle = meeting?.title || meeting?.name || "Reunión finalizada";
  const meetingCodeOrId = meeting?.code || meeting?.id || "";
  const hostDomain = typeof window !== "undefined" ? window.location.host : "meetflow.app";
  const meetingUrl = meetingCodeOrId ? `${hostDomain}/meet/${meetingCodeOrId}` : `${hostDomain}/meetings`;

  return (
    <div
      className={cn(
        "flex-1 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background fade-in",
        className
      )}
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono central de reunión finalizada */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/20">
            <Clock className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Título y subtítulo */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Reunión finalizada
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gracias por usar MeetFlow
          </p>
        </div>

        {/* Métricas destacadas con componentes Card de Shadcn */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border border-border/60 bg-card/60 shadow-sm py-0">
            <CardContent className="p-3.5 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-base font-bold font-sans text-foreground truncate">
                {durationLabel}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Duración</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/60 shadow-sm py-0">
            <CardContent className="p-3.5 text-center">
              <Calendar className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-base font-bold font-sans text-foreground truncate">
                {dateLabel}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Fecha</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/60 shadow-sm py-0">
            <CardContent className="p-3.5 text-center">
              <Users className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-base font-bold font-sans text-foreground truncate">
                {participantsCount}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Participantes</p>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Resumen con Card de Shadcn */}
        <Card className="border border-border/60 bg-card/60 shadow-sm text-left py-0">
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase font-sans">
                RESUMEN
              </p>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Completada
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground font-sans">
              {meetingTitle}
            </p>
            <p className="text-xs text-muted-foreground break-all">
              {meetingUrl}
            </p>
          </CardContent>
        </Card>

        {/* Botones de Navegación con Button de Shadcn */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoHome}
            className="flex-1 h-11 text-xs font-semibold gap-2 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={handleGoHistory}
            className="flex-1 h-11 text-xs font-semibold gap-2 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingEndedScreen;
