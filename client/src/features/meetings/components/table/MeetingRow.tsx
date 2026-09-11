import { memo, useState } from 'react';
import { Clock, Users, Video, MoreHorizontal } from 'lucide-react';
import type { Meeting } from '../../types/meeting';
import { statusClass, statusLabel } from '../../types/meeting';

import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export interface MeetingRowProps {
  meeting: Meeting;
  onJoin: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
}

export const MeetingRow = memo(function MeetingRow({
  meeting: m,
  onJoin,
  onEdit,
}: MeetingRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <TableRow className="hover:bg-white/[0.03] transition-colors group border-b border-border/60 last:border-0">
      {/* Nombre y tipo */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20">
            <Video className="w-4 h-4" />
          </div>
          <span
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {m.name}
          </span>
        </div>
      </TableCell>

      {/* Fecha */}
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">{m.date}</TableCell>

      {/* Hora */}
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">{m.time}</TableCell>

      {/* Duración */}
      <TableCell className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5 opacity-70" />
          {m.duration}
        </span>
      </TableCell>

      {/* Participantes */}
      <TableCell className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-3.5 h-3.5 opacity-70" />
          {Array.isArray(m.participants)
            ? m.participants.length
            : (m.participants ?? 0)}
        </span>
      </TableCell>

      {/* Estado con Badge de Shadcn */}
      <TableCell className="px-4 py-3">
        <Badge
          variant="outline"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass[m.status] || 'badge-blue'}`}
        >
          {statusLabel[m.status] || m.status}
        </Badge>
      </TableCell>

      {/* Acciones con Button y DropdownMenu */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          {m.status === 'live' && (
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
              <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onJoin(m);
                  }}
                  className="cursor-pointer hover:bg-white/[0.06] text-xs"
                >
                  Ver detalles
                </DropdownMenuItem>
                {onEdit && m.status !== 'cancelled' && (
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(m);
                    }}
                    className="cursor-pointer hover:bg-white/[0.06] text-xs"
                  >
                    Editar reunión
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    navigator.clipboard?.writeText(m.roomUrl || window.location.href);
                  }}
                  className="cursor-pointer hover:bg-white/[0.06] text-xs"
                >
                  Copiar enlace
                </DropdownMenuItem>
                {m.status !== 'cancelled' && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setMenuOpen(false)}
                    className="cursor-pointer text-xs"
                  >
                    Cancelar reunión
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
