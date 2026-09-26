import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Meeting } from '@/features/meetings/types/meeting';
import type { CalendarEventStatus } from '../types/agenda.types';
import { AgendaEventCard } from './AgendaEventCard';
import { MONTHS_NAMES, STATUS_COLORS } from '../hooks/useAgenda';
import { cn } from '@/lib/utils';

interface DayDetailPanelProps {
  selectedDate: Date;
  events: Meeting[];
  onCreateMeeting?: () => void;
  className?: string;
}

const LEGEND_ITEMS: { status: CalendarEventStatus; label: string }[] = [
  { status: 'live', label: 'En vivo' },
  { status: 'upcoming', label: 'Próxima' },
  { status: 'completed', label: 'Completada' },
  { status: 'cancelled', label: 'Cancelada' },
];

export function DayDetailPanel({
  selectedDate,
  events,
  onCreateMeeting,
  className,
}: DayDetailPanelProps) {
  const navigate = useNavigate();

  const formattedDate = `${selectedDate.getDate()} de ${MONTHS_NAMES[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;

  const handleCreate = () => {
    if (onCreateMeeting) {
      onCreateMeeting();
    } else {
      navigate('/meetings/create');
    }
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold font-sans">
              {formattedDate}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {events.length === 1 ? '1 evento agendado' : `${events.length} eventos agendados`}
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCreate}
            className="h-8 gap-1 text-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col justify-between gap-4">
        {events.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <CalendarDays className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">Sin reuniones este día</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              No tienes actividades programadas para esta fecha.
            </p>
            <Button
              size="sm"
              onClick={handleCreate}
              className="mt-4 text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear reunión
            </Button>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {events.map((meeting) => (
              <AgendaEventCard key={meeting.id || meeting.code || Math.random()} meeting={meeting} />
            ))}
          </div>
        )}

        <div className="pt-3">
          <Separator className="mb-3" />
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2.5 font-sans">
            Leyenda
          </p>
          <div className="grid grid-cols-2 gap-2">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[item.status].color }}
                />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
