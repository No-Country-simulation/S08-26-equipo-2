import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CalendarDayCell } from '../types/agenda.types';
import { DAYS_NAMES, normalizeMeetingStatus, STATUS_COLORS } from '../hooks/useAgenda';
import { cn } from '@/lib/utils';

interface CalendarWeekGridProps {
  cells: CalendarDayCell[];
  onSelectDay: (date: Date) => void;
  className?: string;
}

export function CalendarWeekGrid({
  cells,
  onSelectDay,
  className,
}: CalendarWeekGridProps) {
  return (
    <Card className={cn('overflow-hidden border', className)}>
      <CardContent className="p-3 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {cells.map((cell, index) => {
            const dayName = DAYS_NAMES[index % 7];

            return (
              <div
                key={cell.dateKey}
                onClick={() => onSelectDay(cell.date)}
                className={cn(
                  'rounded-lg p-2.5 sm:p-3 border transition-all cursor-pointer flex flex-col min-h-[140px] sm:min-h-[300px]',
                  cell.isSelected
                    ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/40'
                    : cell.isToday
                    ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                    : 'border-border/40 bg-card hover:bg-muted/40'
                )}
              >
                {/* Cabecera del día */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center border-b border-border/40 pb-2 mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase font-sans">
                    {dayName}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full mt-0.5 font-sans',
                      cell.isToday
                        ? 'bg-primary text-primary-foreground'
                        : cell.isSelected
                        ? 'text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {cell.dayNumber}
                  </span>
                </div>

                {/* Eventos del día */}
                <div className="flex-1 space-y-1.5 overflow-y-auto">
                  {cell.events.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground/60 text-center py-4 italic">
                      Sin eventos
                    </p>
                  ) : (
                    cell.events.map((ev) => {
                      const st = normalizeMeetingStatus(ev.status);
                      const styling = STATUS_COLORS[st];

                      return (
                        <div
                          key={ev.id || ev.code || Math.random()}
                          className="p-1.5 rounded-md border text-left flex flex-col gap-0.5"
                          style={{
                            backgroundColor: styling.bg,
                            borderColor: styling.border,
                          }}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className="text-[10px] font-semibold"
                              style={{ color: styling.color }}
                            >
                              {ev.time || 'Horario'}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1 py-0 h-3.5 border-none"
                              style={{ color: styling.color }}
                            >
                              {st}
                            </Badge>
                          </div>
                          <span
                            className="text-xs font-medium truncate"
                            style={{ color: styling.color }}
                          >
                            {ev.title || ev.name || 'Reunión'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
