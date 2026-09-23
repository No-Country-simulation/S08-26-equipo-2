import { useAutoJoinAfterApproval } from "../hooks/useAutoJoinAfterApproval";
import { useState, useEffect, useRef } from "react";
import { useMediaSettingsStore } from "@/features/settings/stores/useMediaSettingsStore";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Check,
  X,
  Clock,
  Video,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Hourglass,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  useAccessRequestStore,
  type AccessStatus,
} from "../store/useAccessRequestStore";
import {
  useRequestAccess,
  usePendingAccessRequests,
  useApproveAccessRequest,
  useRejectAccessRequest,
} from "../hooks/useAccessRequests";
import type { Meeting } from "@/features/meetings/types/meeting";

export type WaitingRoomStatus = AccessStatus;

export interface WaitingRoomProps {
  meeting: Meeting;
  isHost?: boolean;
  isAdmittedParticipant?: boolean;
  initialStatus?: WaitingRoomStatus;
  onJoin?: () => void;
  isJoining?: boolean;
  onRefreshMeeting: () => Promise<unknown> | void;
  onLeave: () => void;
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatTimeAgo(isoString?: string) {
  if (!isoString) return "hace un momento";
  const diffSec = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000
  );
  if (diffSec < 60) return `${Math.max(1, diffSec)} s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours} h`;
}

export function WaitingRoom({
  meeting,
  isHost = false,
  isAdmittedParticipant = false,
  initialStatus = "INITIAL",
  onJoin,
  isJoining = false,
  onRefreshMeeting,
  onLeave,
}: WaitingRoomProps) {
  const { user } = useAuthStore();
  const { getStatus, setStatus: setStoreStatus } =
    useAccessRequestStore();

  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingManually, setIsCheckingManually] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pollDurationSeconds, setPollDurationSeconds] = useState(0);

  // Referencias para la vista previa de la camara
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Solicitudes pendientes si es host
  const { data: pendingRequests = [] } = usePendingAccessRequests(
    meeting.id,
    Boolean(isHost && meeting.id)
  );
  const approveMutation = useApproveAccessRequest();
  const rejectMutation = useRejectAccessRequest();
  const requestMutation = useRequestAccess();

  // Estado recuperado de Zustand indexado por usuario + reunion
  const persistedStatus = getStatus(user?.id, meeting.id);
  const resolvedInitial =
    initialStatus !== "INITIAL" ? initialStatus : persistedStatus;

  const [status, setStatus] = useState<WaitingRoomStatus>(resolvedInitial);

  // Actualizar el reloj cada 10 segundos para evaluar el horario en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Inicializar o sincronizar la camara local del usuario
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    if (cam) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          if (isCancelled) {
            s.getTracks().forEach((t) => t.stop());
            return;
          }
          stream = s;
          setMediaStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("No se pudo iniciar la vista previa de la camara:", err);
          setMediaStream(null);
        });
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
      }
    }

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cam]);

  // Limpiar pistas de camara al desmontar para liberar el hardware para LiveKit
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mediaStream]);

  // Calculo del estado del horario (Estilo Google Meet para proteccion de recursos)
  const calculateScheduleState = () => {
    if (meeting.status === "FINISHED" || meeting.status === "CANCELLED") {
      return {
        isFinished: true,
        isTime: false,
        message: "Esta reunión ya ha finalizado.",
        timeLabel: meeting.time || "--:--",
      };
    }

    if (meeting.status === "IN_PROGRESS") {
      return {
        isFinished: false,
        isTime: true,
        message: "La reunión está en vivo.",
        timeLabel: meeting.time || "En vivo",
      };
    }

    if (meeting.scheduledStartAt) {
      const start = new Date(meeting.scheduledStartAt);
      if (!isNaN(start.getTime())) {
        const diffMinutes = Math.round(
          (start.getTime() - currentTime) / (1000 * 60)
        );
        const isTime = currentTime >= start.getTime();

        const timeFormatter = new Intl.DateTimeFormat("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const formattedTime = timeFormatter.format(start);

        let countdownText = "";
        if (diffMinutes > 60) {
          const hours = Math.floor(diffMinutes / 60);
          const mins = diffMinutes % 60;
          countdownText = `inicia en ${hours}h ${mins > 0 ? mins + "m" : ""}`;
        } else if (diffMinutes > 0) {
          countdownText = `inicia en ${diffMinutes} min`;
        } else {
          countdownText = "hora de inicio alcanzada";
        }

        return {
          isFinished: false,
          isTime,
          countdownText,
          scheduledTime: formattedTime,
          message: isTime
            ? "El horario de la reunión está activo."
            : `Programada para las ${formattedTime} (${countdownText})`,
          timeLabel: formattedTime,
        };
      }
    }

    return {
      isFinished: false,
      isTime: true,
      message: "Horario disponible.",
      timeLabel: meeting.time || "Ahora",
    };
  };

  const scheduleState = calculateScheduleState();

  // Consultar mientras la solicitud siga pendiente, sin caducar al minuto.
  useEffect(() => {
    // Si ya tiene acceso directo (host o admitido), no esta en PENDING, o aun NO es la hora: NO hacer sondeo
    if (
      isHost ||
      isAdmittedParticipant ||
      status !== "PENDING" ||
      !scheduleState.isTime
    ) {
      setPollDurationSeconds(0);
      return;
    }


    const interval = setInterval(() => {
      // Optimización: si la pestaña está oculta/minimizada, pausar sondeo
      if (document.hidden) return;

      setPollDurationSeconds((sec) => sec + 3);
      onRefreshMeeting();
    }, 3000);

    return () => clearInterval(interval);
  }, [
    isHost,
    isAdmittedParticipant,
    status,
    scheduleState.isTime,
    onRefreshMeeting,
  ]);
  const displayTitle = meeting.title || meeting.name || "Reunión sin título";
  const displayDate = meeting.date || "Hoy";
  const displayDuration = meeting.duration || "45 min";
  const userName = user?.fullName || user?.email?.split("@")[0] || "Usuario";
  const userInitials = getInitials(userName);

  const handleRequestAccess = async () => {
    if (!meeting.id) return;
    setErrorMessage(null);
    try {
      await requestMutation.mutateAsync(meeting.id);
      if (user?.id) {
        setStoreStatus(user.id, meeting.id, "PENDING");
      }
      setStatus("PENDING");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        if (user?.id) {
          setStoreStatus(user.id, meeting.id, "PENDING");
        }
        setStatus("PENDING");
      } else {
        setErrorMessage(
          error?.response?.data?.message ||
            "Error al enviar la solicitud. Por favor intenta de nuevo."
        );
      }
    }
  };

  const handleManualCheck = async () => {
    setIsCheckingManually(true);
    try {
      setPollDurationSeconds(0); // Reiniciar ventana de sondeo automatico al consultar manualmente
      await onRefreshMeeting();
    } finally {
      setIsCheckingManually(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!meeting.id) return;
    try {
      await approveMutation.mutateAsync({ meetingId: meeting.id, requestId });
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!meeting.id) return;
    try {
      await rejectMutation.mutateAsync({ meetingId: meeting.id, requestId });
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const handleJoinCall = () => {
    useMediaSettingsStore.getState().setIsCameraActive(cam);
    useMediaSettingsStore.getState().setIsMicActive(mic);
    onJoin?.();
  };

  useAutoJoinAfterApproval({
    meetingId: meeting.id,
    enabled: !isHost && status === "PENDING" && isAdmittedParticipant && scheduleState.isTime && !scheduleState.isFinished,
    isJoining,
    onJoin: handleJoinCall,
  });

  const hasAccess = isHost || isAdmittedParticipant;

  return (
    <div
      className="flex-1 min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-6 fade-in">
        {/* Panel Izquierdo: Vista previa de camara y controles de medios */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <div
            className="card overflow-hidden shadow-2xl"
            style={{
              aspectRatio: "16/9",
              position: "relative",
              background: "#050c1e",
            }}
          >
            {cam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  }}
                >
                  {userInitials}
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Cámara apagada
                </p>
              </div>
            )}

            {/* Nombre del usuario superpuesto */}
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <p
                className="text-sm font-semibold px-3 py-1.5 rounded-lg text-white border border-white/10"
                style={{
                  background: "rgba(6,13,31,0.85)",
                  fontFamily: "Plus Jakarta Sans",
                  backdropFilter: "blur(8px)",
                }}
              >
                {userName} (Tú)
              </p>
            </div>

            {/* Indicadores de microfono y camara en esquina superior derecha */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  mic
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}
              >
                {mic ? (
                  <Mic className="w-4 h-4 text-green-400" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  cam
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}
              >
                {cam ? (
                  <Camera className="w-4 h-4 text-green-400" />
                ) : (
                  <CameraOff className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Botones de control de microfono y camara */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => setMic(!mic)}
              className={`control-btn ${!mic ? "danger" : ""}`}
            >
              {mic ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span>{mic ? "Micrófono" : "Silenciado"}</span>
            </button>
            <button
              type="button"
              onClick={() => setCam(!cam)}
              className={`control-btn ${!cam ? "danger" : ""}`}
            >
              {cam ? (
                <Camera className="w-5 h-5" />
              ) : (
                <CameraOff className="w-5 h-5" />
              )}
              <span>{cam ? "Cámara" : "Sin cámara"}</span>
            </button>
          </div>
        </div>

        {/* Panel Derecho: Informacion de la sesion, estado de horario y acciones */}
        <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
          {/* Tarjeta con detalles de la reunion */}
          <div className="card p-5 shadow-xl">
            <p
              className="text-xs font-semibold mb-1 uppercase tracking-wider"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "Plus Jakarta Sans",
              }}
            >
              UNIRSE A
            </p>
            <h2
              className="text-lg font-bold mb-1 text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {displayTitle}
            </h2>
            <p
              className="text-sm mb-4 flex items-center gap-1.5 flex-wrap"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{displayDate}</span>
              <span>·</span>
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{scheduleState.timeLabel}</span>
              <span>·</span>
              <span>{displayDuration}</span>
            </p>

            {/* Error si ocurre alguno */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CASO A: La reunion ya finalizo */}
            {scheduleState.isFinished ? (
              <div className="p-4 rounded-xl mb-4 bg-muted/40 border border-border text-center space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  Reunión finalizada
                </p>
                <p className="text-xs text-muted-foreground">
                  Esta sesión ha concluido o fue cancelada por el anfitrión.
                </p>
                <button
                  onClick={onLeave}
                  className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver a mis reuniones
                </button>
              </div>
            ) : !scheduleState.isTime ? (
              /* CASO B: AUN NO ES EL HORARIO ADECUADO (Proteccion de Recursos) */
              <div className="space-y-4">
                {/* Banner de aviso programado estilo Google Meet */}
                <div
                  className="p-4 rounded-xl flex items-start gap-3"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <Clock className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                  <div>
                    <p
                      className="text-sm font-semibold text-primary"
                      style={{ fontFamily: "Plus Jakarta Sans" }}
                    >
                      Programada para las {scheduleState.scheduledTime || scheduleState.timeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {scheduleState.countdownText
                        ? scheduleState.countdownText.charAt(0).toUpperCase() +
                          scheduleState.countdownText.slice(1)
                        : "Aún no es la hora de inicio de la reunión."}
                    </p>
                  </div>
                </div>

                {/* Si ya es participante o es host: aviso de activacion programada */}
                {hasAccess ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 text-xs font-semibold rounded-xl bg-muted/50 border border-border text-muted-foreground flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                    >
                      <Hourglass className="w-4 h-4 animate-spin text-primary" />
                      El botón de ingreso se activará a las {scheduleState.scheduledTime || scheduleState.timeLabel}
                    </button>
                    <button
                      onClick={onLeave}
                      className="w-full text-xs text-muted-foreground hover:text-foreground py-1 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Salir por ahora
                    </button>
                  </div>
                ) : status === "PENDING" ? (
                  /* Si no es participante y ya envio solicitud */
                  <div className="space-y-3">
                    <div
                      className="p-4 rounded-xl flex items-center gap-3"
                      style={{
                        background: "rgba(234,179,8,0.08)",
                        border: "1px solid rgba(234,179,8,0.2)",
                      }}
                    >
                      <Clock
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: "#fde047" }}
                      />
                      <div>
                        <p
                          className="text-sm font-semibold text-amber-400"
                          style={{ fontFamily: "Plus Jakarta Sans" }}
                        >
                          Esperando aprobación
                        </p>
                        <p className="text-xs text-muted-foreground">
                          El anfitrión debe aceptarte
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-1">
                      <div
                        className="w-2 h-2 rounded-full reconnect-pulse"
                        style={{ background: "#fde047" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Esperando aprobación del anfitrión…
                      </span>
                    </div>

                    <button
                      onClick={onLeave}
                      className="w-full text-xs text-muted-foreground hover:text-foreground py-1 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Salir de la sala de espera
                    </button>
                  </div>
                ) : (
                  /* Si no es participante y aun no solicita acceso */
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      No figuras en la lista de participantes directos. Puedes
                      solicitar acceso al anfitrión.
                    </p>
                    <button
                      onClick={handleRequestAccess}
                      disabled={requestMutation.isPending}
                      className="btn-primary w-full py-3 text-sm cursor-pointer"
                    >
                      {requestMutation.isPending
                        ? "Enviando solicitud..."
                        : "Solicitar acceso"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* CASO C: YA ES EL HORARIO ADECUADO (En vivo o en hora) */
              <div className="space-y-4">
                {hasAccess ? (
                  /* Participante admitido o host en horario: puede entrar de inmediato a LiveKit */
                  <div className="space-y-3">
                    <button
                      onClick={handleJoinCall}
                      disabled={isJoining}
                      className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                      <Video className="w-4 h-4" />
                      {isJoining ? "Preparando tu acceso…" : "Entrar a la reunión"}
                    </button>
                  </div>
                ) : status === "PENDING" ? (
                  /* Solicitud enviada en horario: esperando aceptacion */
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-xl flex items-center gap-3"
                      style={{
                        background: "rgba(234,179,8,0.08)",
                        border: "1px solid rgba(234,179,8,0.2)",
                      }}
                    >
                      <Clock
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: "#fde047" }}
                      />
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ fontFamily: "Plus Jakarta Sans" }}
                        >
                          Esperando aprobación
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          El anfitrión debe aceptarte
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full reconnect-pulse"
                        style={{ background: "#fde047" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Esperando respuesta del anfitrión…
                      </span>
                    </div>

                    {pollDurationSeconds >= 60 && (
                      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                        Seguimos comprobando tu acceso. Entrarás automáticamente cuando el anfitrión te admita.
                      </p>
                    )}

                    <button
                      onClick={handleManualCheck}
                      disabled={isCheckingManually}
                      className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isCheckingManually ? "animate-spin" : ""
                        }`}
                      />
                      {isCheckingManually
                        ? "Verificando acceso..."
                        : "Comprobar estado ahora"}
                    </button>

                    <button
                      onClick={onLeave}
                      className="w-full text-xs text-muted-foreground hover:text-foreground py-1 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Salir de la sala de espera
                    </button>
                  </div>
                ) : (
                  /* No admitido y aun no solicita: boton para solicitar */
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground text-center leading-relaxed">
                      Esta reunión requiere aprobación del anfitrión para unirse.
                    </div>
                    <button
                      onClick={handleRequestAccess}
                      disabled={requestMutation.isPending}
                      className="btn-primary w-full py-3 text-sm cursor-pointer"
                    >
                      {requestMutation.isPending
                        ? "Enviando solicitud..."
                        : "Solicitar ingresar"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tarjeta de Solicitudes Pendientes (Visible unicamente para el Anfitrion) */}
          {isHost && pendingRequests.length > 0 && (
            <div className="card p-5 shadow-xl fade-in">
              <p
                className="text-xs font-semibold mb-3 uppercase tracking-wider text-amber-400"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                SOLICITUDES PENDIENTES ({pendingRequests.length})
              </p>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {pendingRequests.map((p) => {
                  const reqUserName =
                    p.user?.fullName || p.user?.email || "Participante";
                  const reqUserAvatar = getInitials(reqUserName);
                  const timeFormatted = formatTimeAgo(p.requestedAt);

                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-xl bg-muted/20 border border-border/50"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        }}
                      >
                        {reqUserAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate text-foreground"
                          style={{ fontFamily: "Plus Jakarta Sans" }}
                        >
                          {reqUserName}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {timeFormatted}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApprove(p.id)}
                        disabled={approveMutation.isPending}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-green-500/20"
                        style={{
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.3)",
                        }}
                        title="Aprobar acceso"
                      >
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(p.id)}
                        disabled={rejectMutation.isPending}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-red-500/20"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                        title="Rechazar solicitud"
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
