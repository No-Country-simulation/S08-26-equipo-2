import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import { useTableMeetings } from '../../hooks/useTableMeetings';
import { useCloseMeeting } from '../../hooks/useMeetings';
import type { Meeting, MeetingsTableProps } from '../../types/meeting';

// Subcomponentes modulares de la tabla
import { MeetingsHeader } from './MeetingsHeader';
import { MeetingsFilters } from './MeetingsFilters';
import { MeetingRow } from './MeetingRow';
import { MeetingsEmptyState } from './MeetingsEmptyState';
import { CancelMeetingDialog } from './CancelMeetingDialog';
import { MeetingDetailsSheet } from './MeetingDetailsSheet';

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
  onViewDetailsMeeting,
  className = '',
  title = 'Agenda de reuniones',
  showCreateButton = true,
}: MeetingsTableProps) {
  const navigate = useNavigate();
  const [meetingToCancel, setMeetingToCancel] = useState<Meeting | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const closeMutation = useCloseMeeting();

  const handleRowCancel = (meeting: Meeting) => {
    if (onCancelMeeting) {
      onCancelMeeting(meeting);
    } else {
      setCancelError(null);
      setMeetingToCancel(meeting);
    }
  };

  const handleRowViewDetails = (meeting: Meeting) => {
    if (onViewDetailsMeeting) {
      onViewDetailsMeeting(meeting);
    } else {
      setSelectedMeeting(meeting);
    }
  };

  const handleDefaultJoin = (meeting: Meeting) => {
    if (onJoinMeeting) {
      onJoinMeeting(meeting);
    } else if (meeting.id) {
      navigate(`/meet/${meeting.id}`);
    } else if (onNav) {
      onNav('video-room');
    } else {
      navigate('/livekit');
    }
  };

  const handleConfirmCancel = async () => {
    if (!meetingToCancel?.id) return;
    setCancelError(null);
    try {
      await closeMutation.mutateAsync(meetingToCancel.id);
      setMeetingToCancel(null);
    } catch (err: unknown) {
      console.error('Error al finalizar la reunión:', err);
      let message = 'No se pudo finalizar la reunión. Verifica si tienes permisos de anfitrión.';
      if (axios.isAxiosError(err)) {
        const serverMsg = err.response?.data?.message;
        if (typeof serverMsg === 'string') {
          message = serverMsg;
        } else if (Array.isArray(serverMsg)) {
          message = serverMsg.join(', ');
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setCancelError(message);
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
    handleEdit,
    handleCancel,
    handleViewDetails,
  } = useTableMeetings({
    onNav,
    onCreateMeeting,
    onJoinMeeting: handleDefaultJoin,
    onEditMeeting,
    onCancelMeeting: handleRowCancel,
    onViewDetailsMeeting: handleRowViewDetails,
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
              {['Reunión', 'Fecha', 'Hora', 'Duración', 'Estado', 'Acciones'].map((h) => (
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
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm">Cargando agenda...</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting, index) => (
                <MeetingRow
                  key={meeting.id || meeting.code || index}
                  meeting={meeting}
                  onJoin={handleDefaultJoin}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* 4. Estado vacío si no hay coincidencias */}
        {!isLoading && filteredMeetings.length === 0 && <MeetingsEmptyState />}
      </Card>

      {/* 5. Modal de confirmación para finalizar reunión */}
      <CancelMeetingDialog
        meeting={meetingToCancel}
        open={Boolean(meetingToCancel)}
        onOpenChange={(open) => {
          if (!open) {
            setMeetingToCancel(null);
            setCancelError(null);
          }
        }}
        onConfirm={handleConfirmCancel}
        isPending={closeMutation.isPending}
        errorMessage={cancelError}
      />

      {/* 6. Sheet lateral con los detalles completos de la reunión */}
      <MeetingDetailsSheet
        meeting={selectedMeeting}
        open={Boolean(selectedMeeting)}
        onOpenChange={(open) => {
          if (!open) setSelectedMeeting(null);
        }}
        onJoin={handleDefaultJoin}
        onEdit={handleEdit}
      />
    </div>
  );
}

export { MeetingsTable };
