import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, AlertCircle } from 'lucide-react';
import { useAgenda } from '../hooks/useAgenda';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarMonthGrid } from '../components/CalendarMonthGrid';
import { CalendarWeekGrid } from '../components/CalendarWeekGrid';
import { DayDetailPanel } from '../components/DayDetailPanel';
import type { AgendaScreenProps } from '../types/agenda.types';
import { cn } from '@/lib/utils';

export function AgendaScreen({ onNav, className }: AgendaScreenProps) {
  const navigate = useNavigate();
  const {
    viewMode,
    setViewMode,
    monthName,
    year,
    monthCells,
    weekCells,
    selectedDate,
    selectedDayEvents,
    selectDay,
    goToNext,
    goToPrevious,
    goToToday,
    isLoading,
    isError,
    refetch,
  } = useAgenda();

  const handleCreateMeeting = () => {
    if (onNav) {
      onNav('create-meeting');
    } else {
      navigate('/meetings/create');
    }
  };

  return (
    <div className={cn('p-4 sm:p-6 w-full', className)}>
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        monthName={monthName}
        year={year}
        onPrev={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onCreateMeeting={handleCreateMeeting}
      />

      {isError && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No se pudo sincronizar la agenda de reuniones.</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="text-xs gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[460px] w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-[460px] w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Grilla de calendario: Mes o Semana (acompaña con sticky en desktop) */}
          <div className="lg:col-span-2 lg:sticky lg:top-4 self-start">
            {viewMode === 'month' ? (
              <CalendarMonthGrid
                cells={monthCells}
                onSelectDay={selectDay}
              />
            ) : (
              <CalendarWeekGrid
                cells={weekCells}
                onSelectDay={selectDay}
              />
            )}
          </div>

          {/* Panel de detalle del día seleccionado y leyenda */}
          <div className="lg:col-span-1">
            <DayDetailPanel
              selectedDate={selectedDate}
              events={selectedDayEvents}
              onCreateMeeting={handleCreateMeeting}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AgendaScreen;
