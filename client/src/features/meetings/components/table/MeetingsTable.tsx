import { RefreshCw } from 'lucide-react';
import { useTableMeetings } from '../../hooks/useTableMeetings';
import type { MeetingsTableProps } from '../../types/meeting';

// Subcomponentes modulares de la tabla
import { MeetingsHeader } from './MeetingsHeader';
import { MeetingsFilters } from './MeetingsFilters';
import { MeetingRow } from './MeetingRow';
import { MeetingsEmptyState } from './MeetingsEmptyState';

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
  className = '',
  title = 'Historial de reuniones',
  showCreateButton = true,
}: MeetingsTableProps) {
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
  } = useTableMeetings({ onNav, onCreateMeeting, onJoinMeeting });

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
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* 4. Estado vacío si no hay coincidencias */}
        {!isLoading && filteredMeetings.length === 0 && <MeetingsEmptyState />}
      </Card>
    </div>
  );
}

export { MeetingsTable };
