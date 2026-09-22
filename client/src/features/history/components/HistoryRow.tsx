import { memo } from "react";
import { CheckCircle2, Clock, Users, Eye } from "lucide-react";
import type { HistoryMeetingUI } from "../types/history";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HistoryRowProps {
  meeting: HistoryMeetingUI;
  onViewDetails: (meeting: HistoryMeetingUI) => void;
}

export const HistoryRow = memo(function HistoryRow({
  meeting: m,
  onViewDetails,
}: HistoryRowProps) {
  const displayTitle = m.title || "Reunión finalizada";
  const participantsCount = Array.isArray(m.participants)
    ? m.participants.length
    : 0;

  return (
    <TableRow className="hover:bg-white/[0.03] transition-colors group border-b border-border/60 last:border-0">
      {/* Nombre e icono */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <Button
              type="button"
              variant="link"
              onClick={() => onViewDetails(m)}
              className="p-0 h-auto text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer text-left block truncate max-w-[200px] sm:max-w-xs"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {displayTitle}
            </Button>
            {m.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                {m.description}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Fecha */}
      <TableCell className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
        {m.date}
      </TableCell>

      {/* Horario y Duración */}
      <TableCell className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span>
            {m.startTime} - {m.endTime}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
            <Clock className="w-3 h-3" />
            {m.durationLabel}
          </span>
        </div>
      </TableCell>

      {/* Asistentes */}
      <TableCell className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Users className="w-3.5 h-3.5 text-primary" />
          {participantsCount}
        </span>
      </TableCell>

      {/* Estado */}
      <TableCell className="px-4 py-3.5 whitespace-nowrap">
        <Badge
          variant="outline"
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-blue"
        >
          Finalizada
        </Badge>
      </TableCell>

      {/* Accion unica: Ver detalles */}
      <TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(m)}
          className="h-8 px-3 text-xs flex items-center gap-1.5 border-border hover:bg-white/[0.06] hover:text-foreground cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-primary" />
          Ver detalles
        </Button>
      </TableCell>
    </TableRow>
  );
});

export default HistoryRow;
