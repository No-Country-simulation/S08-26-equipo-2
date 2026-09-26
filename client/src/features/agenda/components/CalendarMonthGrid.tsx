import { Card, CardContent } from '@/components/ui/card';
import type { CalendarDayCell } from '../types/agenda.types';
import { DAYS_NAMES, normalizeMeetingStatus, STATUS_COLORS } from '../hooks/useAgenda';
import { cn } from '@/lib/utils';

interface CalendarMonthGridProps {
  cells: CalendarDayCell[];
  onSelectDay: (date: Date) => void;
  className?: string;
}

export function CalendarMonthGrid({
  cells,
  onSelectDay,
  className,
}: CalendarMonthGridProps) {
  return (
    <Card className={cn('overflow-hidden border', className)}>
      <CardContent className="p-3 sm:p-5">
        {/* Cabecera de días de la semana */}
        <div className="grid grid-cols-7 mb-2 border-b border-border/40 pb-2">
          {DAYS_NAMES.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground py-1 font-sans uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Cuadrícula de días */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((cell) => {
            const statusSummary = cell.events.map((e) => normalizeMeetingStatus(e.status));
            const hasLive = statusSummary.includes('live');

            return (
              <button
                key={cell.dateKey + cell.dayNumber}
                type="button"
                onClick={() => onSelectDay(cell.date)}
                className={cn(
                  'group relative min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-lg text-left transition-all duration-150 flex flex-col justify-start border outline-none',
                  cell.isSelected
                    ? 'border-primary/60 bg-primary/10 shadow-sm ring-1 ring-primary/40'
                    : cell.isToday
                    ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                    : 'border-border/40 bg-card hover:bg-muted/40 hover:border-border',
                  !cell.isCurrentMonth && 'opacity-35 hover:opacity-75'
                )}
              >
                {/* Número del día e indicador 'live' */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={cn(
                      'text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center font-sans',
                      cell.isToday
                        ? 'bg-primary text-primary-foreground font-bold'
                        : cell.isSelected
                        ? 'text-primary font-bold'
                        : 'text-foreground'
                    )}
                  >
                    {cell.dayNumber}
                  </span>

                  {hasLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </div>

                {/* Eventos resumidos */}
                <div className="flex-1 w-full space-y-1 overflow-hidden">
                  {cell.events.slice(0, 2).map((ev) => {
                    const st = normalizeMeetingStatus(ev.status);
                    const styling = STATUS_COLORS[st];
                    return (
                      <div
                        key={ev.id || ev.code || Math.random()}
                        className="text-[10px] px-1 py-0.5 rounded truncate font-medium flex items-center gap-1 border"
                        style={{
                          backgroundColor: styling.bg,
                          color: styling.color,
                          borderColor: styling.border,
                        }}
                      >
                        {ev.time && <span className="shrink-0 opacity-80">{ev.time}</span>}
                        <span className="truncate">{ev.title || ev.name || 'Reunión'}</span>
                      </div>
                    );
                  })}

                  {cell.events.length > 2 && (
                    <div className="text-[10px] text-muted-foreground font-medium px-1">
                      +{cell.events.length - 2} más
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
