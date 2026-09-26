import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarViewMode } from '../types/agenda.types';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  title?: string;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  monthName: string;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateMeeting: () => void;
  className?: string;
}

export function CalendarHeader({
  title = 'Calendario',
  viewMode,
  onViewModeChange,
  monthName,
  year,
  onPrev,
  onNext,
  onToday,
  onCreateMeeting,
  className,
}: CalendarHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6',
        className
      )}
    >
      {/* Título y Selector de vista (Mes / Semana) */}
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          {title}
        </h1>

        <div className="inline-flex items-center p-1 rounded-lg bg-muted/60 border border-border/50">
          <Button
            size="sm"
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('month')}
            className={cn(
              'h-7 px-3 text-xs font-semibold rounded-md transition-all',
              viewMode === 'month'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Mes
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('week')}
            className={cn(
              'h-7 px-3 text-xs font-semibold rounded-md transition-all',
              viewMode === 'week'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Semana
          </Button>
        </div>
      </div>

      {/* Navegación temporal y botón Crear Reunión */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-card border border-border/60 rounded-lg p-0.5">
          <Button
            size="icon"
            variant="ghost"
            onClick={onPrev}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-xs sm:text-sm font-semibold px-2 min-w-[130px] text-center font-sans">
            {monthName} {year}
          </span>

          <Button
            size="icon"
            variant="ghost"
            onClick={onNext}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onToday}
          className="h-9 text-xs font-medium"
        >
          Hoy
        </Button>

        <Button
          size="sm"
          onClick={onCreateMeeting}
          className="h-9 px-3.5 text-xs font-semibold gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Crear reunión
        </Button>
      </div>
    </div>
  );
}
