import { memo, useState } from "react";
import { Clock, Video, MoreHorizontal, Copy, Check } from "lucide-react";
import type { Meeting } from "../../types/meeting";
import { statusClass, statusLabel } from "../../types/meeting";

import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface MeetingRowProps {
  meeting: Meeting;
  onJoin: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
  onViewDetails?: (meeting: Meeting) => void;
}

export const MeetingRow = memo(function MeetingRow({
  meeting: m,
  onJoin,
  // onEdit,
  onCancel,
  onViewDetails,
}: MeetingRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayTitle = m.title || m.name || "Reunión";
  const meetLink = m.id
    ? `${window.location.origin}/meet/${m.id}`
    : (m.roomUrl || `${window.location.origin}/meet`);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = m.status === "IN_PROGRESS" || m.status === "live";
  const isScheduled = m.status === "SCHEDULED" || m.status === "upcoming";

  return (
    <TableRow className="hover:bg-white/[0.03] transition-colors group border-b border-border/60 last:border-0">
      {/* Nombre y código */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20">
            <Video className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <Button
              type="button"
              variant="link"
              onClick={() => (onViewDetails ? onViewDetails(m) : onJoin(m))}
              className="p-0 h-auto text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer text-left block truncate max-w-[200px] sm:max-w-xs"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {displayTitle}
            </Button>
          </div>
        </div>
      </TableCell>

      {/* Fecha */}
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {m.date || "Por definir"}
      </TableCell>

      {/* Hora */}
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {m.time || "--:--"}
      </TableCell>

      {/* Duración */}
      <TableCell className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5 opacity-70" />
          {m.duration || "60 min"}
        </span>
      </TableCell>

      {/* Estado con Badge de Shadcn */}
      <TableCell className="px-4 py-3">
        <Badge
          variant="outline"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            statusClass[m.status] || "badge-blue"
          }`}
        >
          {statusLabel[m.status] || m.status}
        </Badge>
      </TableCell>

      {/* Acciones */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          {(isLive || isScheduled) && (
            <Button
              size="sm"
              onClick={() => onJoin(m)}
              className="btn-primary h-7 px-3 text-xs cursor-pointer shadow-md shadow-primary/20"
            >
              Unirse
            </Button>
          )}

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger
              title="Más opciones"
              className="btn-ghost p-1.5 rounded-lg text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center border border-border"
            >
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            {menuOpen && (
              <DropdownMenuContent
                align="end"
                className="w-44 bg-card border border-border text-foreground"
              >
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    if (onViewDetails) {
                      onViewDetails(m);
                    } else {
                      onJoin(m);
                    }
                  }}
                  className="cursor-pointer hover:bg-white/[0.06] text-xs"
                >
                  Ver detalles
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    handleCopyLink();
                  }}
                  className="cursor-pointer hover:bg-white/[0.06] text-xs flex items-center justify-between"
                >
                  <span>Copiar enlace</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </DropdownMenuItem>

                {m.status !== "FINISHED" && m.status !== "CANCELLED" && onCancel && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setMenuOpen(false);
                      onCancel(m);
                    }}
                    className="cursor-pointer text-xs text-destructive focus:text-destructive"
                  >
                    Finalizar reunión
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
});

export default MeetingRow;
