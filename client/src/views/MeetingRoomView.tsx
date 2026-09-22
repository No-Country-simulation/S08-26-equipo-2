import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMeeting } from "@/features/meetings/hooks/useMeetings";
import { WaitingRoom, useAccessRequestStore } from "@/features/invitations-access";
import LivekitPage from "./livekit/LivekitPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

/**
 * Vista central orquestadora de reuniones (/meet/:id).
 * Presenta la sala previa (WaitingRoom) para pruebas de camara/microfono,
 * control estricto de horario programado para optimizar recursos, y bifurcacion a LiveKit.
 */
export function MeetingRoomView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clearRequest } = useAccessRequestStore();

  const [inCall, setInCall] = useState(false);

  const {
    data: meeting,
    isLoading,
    isError,
    refetch,
  } = useMeeting(id);

  // 1. Validar si el usuario es el anfitrion de la sesion
  const isHost = Boolean(user?.id && meeting?.hostId === user.id);

  // 2. Validar si el usuario ya es un participante registrado y admitido
  const participants = Array.isArray(meeting?.participants)
    ? meeting.participants
    : [];

  const isAdmittedParticipant = participants.some((p: any) => {
    if (typeof p === "object" && p !== null) {
      const participantUserId = p.user?.id || p.userId;
      return (
        participantUserId === user?.id &&
        p.connectionStatus !== "LEFT"
      );
    }
    return false;
  });

  const hasAccess = isHost || isAdmittedParticipant;

  // Si ya tiene acceso o fue admitido, limpiar el estado de solicitud pendiente guardado para este usuario
  useEffect(() => {
    if (hasAccess && user?.id && meeting?.id) {
      clearRequest(user.id, meeting.id);
    }
  }, [hasAccess, user?.id, meeting?.id, clearRequest]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 space-y-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border p-6 rounded-2xl text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Reunión no encontrada
          </h2>
          <p className="text-xs text-muted-foreground">
            No fue posible cargar los datos de la reunión. Es posible que el
            enlace sea incorrecto o que la reunión haya finalizado.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/meetings")}
            className="w-full text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a mis reuniones
          </Button>
        </div>
      </div>
    );
  }

  // Si el usuario ya inicio la llamada tras pasar la validacion de horario y permisos
  if (inCall) {
    return <LivekitPage />;
  }

  // Pre-join y sala de espera general:
  // Controla permisos, hardware previo (camara/microfono) y horarios antes de consumir servidores de videollamada
  return (
    <WaitingRoom
      meeting={meeting}
      isHost={isHost}
      isAdmittedParticipant={isAdmittedParticipant}
      onJoin={() => setInCall(true)}
      onRefreshMeeting={refetch}
      onLeave={() => navigate("/meetings")}
    />
  );
}

export default MeetingRoomView;
