import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTableMeetings } from '../../hooks/useTableMeetings';
import { useCancelMeeting } from '../../hooks/useMeetings';
import type { Meeting, MeetingsTableProps } from '../../types/meeting';

// Subcomponentes modulares de la tabla
import { MeetingsHeader } from './MeetingsHeader';
import { MeetingsFilters } from './MeetingsFilters';
import { MeetingRow } from './MeetingRow';
import { MeetingsEmptyState } from './MeetingsEmptyState';
import { CancelMeetingDialog } from './CancelMeetingDialog';

// Componentes de Shadcn UI
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export default function MeetingsTable({
  onNav,
  onCreateMeeting,
  onJoinMeeting,
  onEditMeeting,
  onCancelMeeting,
  className = '',
  title = 'Historial de reuniones',
  showCreateButton = true,
}: MeetingsTableProps) {
  const [meetingToCancel, setMeetingToCancel] = useState<Meeting | null>(null);
  const cancelMutation = useCancelMeeting();

  const handleRowCancel = (meeting: Meeting) => {
    if (onCancelMeeting) {
      onCancelMeeting(meeting);
    } else {
      setMeetingToCancel(meeting);
    }
  };

  const handleConfirmCancel = async () => {
    if (!meetingToCancel?.id) return;
    try {
      await cancelMutation.mutateAsync(meetingToCancel.id);
      setMeetingToCancel(null);
    } catch (err) {
      console.error('Error al cancelar la reunión:', err);
    }
  };

  const {
    filteredMeetings,
    isLoading,
    isFetching,
    refetch,
    query,
    setQuery,
    filter,
    setFilter,
    handleCreate,
    handleJoin,
    handleEdit,
    handleCancel,
  } = useTableMeetings({
    onNav,
    onCreateMeeting,
    onJoinMeeting,
    onEditMeeting,
    onCancelMeeting: handleRowCancel,
  });

  return (
    <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
      {/* 1. Header con título, contador y botón de nueva reunión */}
      <MeetingsHeader
        title={title}
        count={filteredMeetings.length}
        isFetching={isFetching}
        showCreateButton={showCreateButton}
        onRefresh={refetch}
        onCreate={handleCreate}
      />

      {/* 2. Barra de búsqueda y tabs de filtrado por estado */}
      <MeetingsFilters
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* 3. Tabla principal envolvente con Card y Table de Shadcn */}
      <Card className="border border-border overflow-hidden bg-card rounded-xl shadow-xl py-0 gap-0">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="border-b border-border bg-white/[0.02] hover:bg-transparent">
              {['Reunión', 'Fecha', 'Hora', 'Duración', 'Participantes', 'Estado', 'Acciones'].map((h) => (
                <TableHead
                  key={h}
                  className="px-4 py-3 text-xs font-semibold text-muted-foreground"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm">Cargando reuniones...</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting, index) => (
                <MeetingRow
                  key={meeting.id || index}
                  meeting={meeting}
                  onJoin={handleJoin}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* 4. Estado vacío si no hay coincidencias */}
        {!isLoading && filteredMeetings.length === 0 && <MeetingsEmptyState />}
      </Card>

      {/* 5. Modal de confirmación para cancelar reunión con Shadcn AlertDialog */}
      <CancelMeetingDialog
        meeting={meetingToCancel}
        open={Boolean(meetingToCancel)}
        onOpenChange={(open) => {
          if (!open) setMeetingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
}

export { MeetingsTable };
