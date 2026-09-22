import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Copy,
  Check,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { Meeting, MeetingParticipantDto } from "../../types/meeting";
import { statusClass, statusLabel } from "../../types/meeting";
import { useMeeting } from "../../hooks/useMeetings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { PendingAccessRequestsList } from "@/features/invitations-access";

export interface MeetingDetailsSheetProps {
  meeting: Meeting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
}

export function MeetingDetailsSheet({
  meeting: initialMeeting,
  open,
  onOpenChange,
  onJoin,
  // onEdit,
}: MeetingDetailsSheetProps) {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const { data: fullMeeting, isLoading } = useMeeting(
    open && initialMeeting?.id ? initialMeeting.id : undefined
  );
  const meeting = fullMeeting || initialMeeting;

  if (!meeting) return null;

  const isHost = Boolean(user?.id && meeting.hostId === user.id);

  const displayTitle = meeting.title || meeting.name || "Reunión";
  const roomLink = meeting.id
    ? `${window.location.origin}/meet/${meeting.id}`
    : (meeting.roomUrl || `${window.location.origin}/meet`);

  const handleCopy = () => {
    navigator.clipboard?.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const participantsList = Array.isArray(meeting.participants)
    ? (meeting.participants as (MeetingParticipantDto | string)[])
    : [];

  const participantsCount = Array.isArray(meeting.participants)
    ? meeting.participants.length
    : (typeof meeting.participants === "number" ? meeting.participants : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card border-l border-border flex flex-col p-0 overflow-hidden"
      >
        {/* Encabezado */}
        <SheetHeader className="p-6 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                statusClass[meeting.status] || "badge-blue"
              }`}
            >
              {statusLabel[meeting.status] || meeting.status}
            </Badge>
          </div>
          <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2 leading-snug">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Video className="w-4 h-4" />
            </div>
            <span className="truncate">{displayTitle}</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Información detallada y opciones de la reunión
          </SheetDescription>
        </SheetHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Horario y Duración */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-background/60 border border-border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Fecha
              </span>
              <span className="text-sm font-semibold text-foreground">
                {meeting.date || "Por definir"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-background/60 border border-border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Hora y Duración
              </span>
              <span className="text-sm font-semibold text-foreground">
                {meeting.time || "--:--"} ({meeting.duration || "60 min"})
              </span>
            </div>
          </div>

          {/* Enlace de la reunión */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Enlace de la sala
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border">
              <span className="text-xs text-foreground truncate flex-1 font-mono select-all">
                {roomLink}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Copiado
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Solicitudes de acceso pendientes (solo para el anfitrion) */}
          {isHost && meeting.id && (
            <PendingAccessRequestsList meetingId={meeting.id} />
          )}

          {/* Participantes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                Participantes ({participantsCount})
              </label>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/40 border border-border/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-2.5 w-36 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                ))}
              </div>
            ) : participantsList.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {participantsList.map((p, idx) => {
                  const isDto = typeof p === "object" && p !== null && "user" in p;
                  const name = isDto
                    ? (p as MeetingParticipantDto).user?.fullName
                    : (typeof p === "string" ? p : "Participante");
                  const email = isDto
                    ? (p as MeetingParticipantDto).user?.email
                    : (typeof p === "string" ? p : "");
                  const role = isDto ? (p as MeetingParticipantDto).role : "";
                  const initial = (name || email || "P")[0].toUpperCase();

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-background/40 border border-border/60 text-xs text-foreground"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          {initial}
                        </div>
                        <div className="truncate min-w-0">
                          <p className="font-semibold truncate">{name}</p>
                          {email && email !== name && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {email}
                            </p>
                          )}
                        </div>
                      </div>
                      {role && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {role}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {participantsCount > 0
                  ? `${participantsCount} participantes registrados.`
                  : "No hay participantes registrados aún en esta reunión."}
              </p>
            )}
          </div>

          {/* Descripción / Notas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Descripción
            </label>
            <div className="p-3.5 rounded-xl bg-background/40 border border-border/60 text-xs text-muted-foreground leading-relaxed">
              {meeting.description ? (
                meeting.description
              ) : (
                <span className="italic">
                  Sin descripción adicional para esta reunión.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones en el pie del Sheet */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 gap-2 flex-row sm:justify-end">
          {onJoin && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onJoin(meeting);
              }}
              className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Unirse a la sala
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MeetingDetailsSheet;
