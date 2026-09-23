import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import type { Meeting, Screen } from '../types/meeting';
import { useMeeting } from '../hooks/useMeetings';
import { MeetingForm } from '../components/form/MeetingForm';
import { MeetingSuccess } from '../components/form/MeetingSuccess';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

// TODO: Esta pantalla de edición está preparada pero inactiva en la navegación principal
// debido a que el endpoint PATCH /meetings/:id en el backend aún no está completamente operativo.
// Cuando se habilite, se recomienda permitir modificar únicamente título y descripción,
// dejando bloqueados la fecha y hora para evitar problemas de reprogramación.

export interface EditMeetingScreenProps {
  meeting?: Meeting;
  onNav?: (screen: Screen) => void;
}

type Step = 'form' | 'success';

export default function EditMeetingScreen({
  meeting: initialMeeting,
  onNav,
}: EditMeetingScreenProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: fetchedMeeting, isLoading } = useMeeting(initialMeeting ? undefined : id);
  const meeting = initialMeeting || fetchedMeeting;

  const [step, setStep] = useState<Step>('form');
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting | null>(null);

  const handleNav = (screen: Screen) => {
    if (onNav) {
      onNav(screen);
      return;
    }
    if (screen === 'dashboard' || screen === 'history') {
      navigate('/meetings');
    } else if (screen === 'video-room') {
      navigate('/livekit');
    }
  };

  const handleSuccess = (m: Meeting) => {
    setUpdatedMeeting(m);
    setStep('success');
  };

  if (step === 'success' && updatedMeeting) {
    return <MeetingSuccess meeting={updatedMeeting} isEdit={true} onNav={handleNav} />;
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>

          {/* Form Card Skeleton */}
          <Card className="p-6 border-border bg-card rounded-2xl shadow-xl space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            {/* Fecha, Hora, Duración */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>

            {/* Participantes */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>

            {/* Botón Guardar */}
            <div className="pt-2 flex justify-end">
              <Skeleton className="h-11 w-44 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!meeting && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
        <h2 className="text-lg font-bold text-foreground">Reunión no encontrada</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          No se encontró la reunión que deseas editar.
        </p>
        <Button onClick={() => navigate('/meetings')} variant="outline" className="cursor-pointer">
          Volver a la agenda
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Editar reunión
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Modifica los datos de la reunión programada
          </p>
        </div>

        <MeetingForm initialData={meeting} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export { EditMeetingScreen };
