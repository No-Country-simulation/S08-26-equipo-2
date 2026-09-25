import { memo } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  FileText,
} from "lucide-react";
import type { HistoryMeetingUI, HistoryParticipantDto } from "../types/history";
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
import { HistoryChatSection } from "./HistoryChatSection";

export interface HistoryDetailsSheetProps {
  meeting: HistoryMeetingUI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HistoryDetailsSheet = memo(function HistoryDetailsSheet({
  meeting,
  open,
  onOpenChange,
}: HistoryDetailsSheetProps) {
  if (!meeting) return null;

  const displayTitle = meeting.title || "Reunión finalizada";
  const participantsList = Array.isArray(meeting.participants)
    ? meeting.participants
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card border-l border-border flex flex-col p-0 overflow-hidden"
      >
        {/* Encabezado */}
        <SheetHeader className="p-6 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs px-2.5 py-0.5 rounded-full font-medium badge-blue border"
            >
              Finalizada
            </Badge>
          </div>
          <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2.5 leading-snug">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="truncate">{displayTitle}</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Resumen de la sesión y registro de participantes
          </SheetDescription>
        </SheetHeader>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Horario y Duración */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-background/60 border border-border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Fecha
              </span>
              <span className="text-sm font-semibold text-foreground">
                {meeting.date}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-background/60 border border-border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Horario y Duración
              </span>
              <span className="text-sm font-semibold text-foreground">
                {meeting.startTime} - {meeting.endTime}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {meeting.durationLabel}
              </span>
            </div>
          </div>

          {/* Participantes que asistieron */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                Asistentes ({participantsList.length})
              </label>
            </div>

            {participantsList.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {participantsList.map((p: HistoryParticipantDto) => {
                  const name = p.user?.fullName || p.user?.email || "Participante";
                  const email = p.user?.email || "";
                  const role = p.role || "PARTICIPANT";
                  const initial = (name || email || "P")[0].toUpperCase();
                  const isHost = role === "HOST";

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-border/70 text-xs text-foreground"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 uppercase ${
                            isHost
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {initial}
                        </div>
                        <div className="truncate min-w-0">
                          <p className="font-semibold truncate text-foreground">
                            {name}
                          </p>
                          {email && email !== name && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {email}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 capitalize ${
                          isHost
                            ? "border-primary/40 text-primary bg-primary/10"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {isHost ? "Anfitrión" : "Participante"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-1">
                No hubo participantes registrados en esta sesión.
              </p>
            )}
          </div>

          {/* Descripción */}
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
                  Sin descripción registrada para esta reunión.
                </span>
              )}
            </div>
          </div>

          {/* Historial de Mensajes del Chat */}
          <HistoryChatSection
            meetingId={meeting.id}
            hostId={meeting.hostId}
            enabled={open}
          />
        </div>

        {/* Pie del Sheet */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 gap-2 flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Cerrar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

export default HistoryDetailsSheet;
