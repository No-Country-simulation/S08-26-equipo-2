import { useNavigate } from 'react-router-dom';
import { Video, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Meeting } from '@/features/meetings/types/meeting';
import { normalizeMeetingStatus, STATUS_COLORS } from '../hooks/useAgenda';
import { cn } from '@/lib/utils';

interface AgendaEventCardProps {
  meeting: Meeting;
  className?: string;
}

export function AgendaEventCard({ meeting, className }: AgendaEventCardProps) {
  const navigate = useNavigate();
  const status = normalizeMeetingStatus(meeting.status);
  const styling = STATUS_COLORS[status];

  const statusLabel = {
    live: 'En vivo',
    upcoming: 'Próxima',
    completed: 'Completada',
    cancelled: 'Cancelada',
  }[status];

  const handleJoin = () => {
    if (meeting.id) {
      navigate(`/meet/${meeting.id}`);
    }
  };

  const participantsCount = Array.isArray(meeting.participants)
    ? meeting.participants.length
    : typeof meeting.participants === 'number'
    ? meeting.participants
    : 0;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-md border',
        className
      )}
      style={{
        borderColor: styling.border,
        background: 'hsl(var(--card))',
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={{ backgroundColor: styling.color }}
      />

      <CardContent className="p-3.5 pl-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-tight text-foreground truncate font-sans">
              {meeting.title || meeting.name || 'Reunión sin título'}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {meeting.time || 'Horario no definido'}
              </span>
              {meeting.duration && (
                <>
                  <span>•</span>
                  <span>{meeting.duration}</span>
                </>
              )}
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-medium shrink-0"
            style={{
              color: styling.color,
              backgroundColor: styling.bg,
              borderColor: styling.border,
            }}
          >
            {statusLabel}
          </Badge>
        </div>

        {participantsCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{participantsCount} participante(s)</span>
          </div>
        )}

        {(status === 'live' || status === 'upcoming') && (
          <div className="pt-1">
            <Button
              size="sm"
              onClick={handleJoin}
              className="w-full text-xs font-semibold gap-1.5 shadow-sm"
              style={
                status === 'live'
                  ? {
                      backgroundColor: styling.color,
                      color: '#ffffff',
                    }
                  : undefined
              }
            >
              <Video className="w-3.5 h-3.5" />
              Unirse
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
