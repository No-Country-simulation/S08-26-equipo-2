import { PendingAccessRequestsList } from "@/features/invitations-access/components/PendingAccessRequestsList";
import { usePendingAccessRequests } from "@/features/invitations-access/hooks/useAccessRequests";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  VideoTrack,
  isTrackReference,
  useConnectionState,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useSpeakingParticipants,
  useTracks,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { useMeetingChat, ChatPanel } from "@/features/chat";
import { ConnectionError, ConnectionState, Track } from "livekit-client";
import {
  Camera,
  CameraOff,
  Check,
  Copy,
  Maximize,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  MoreHorizontal,
  PhoneOff,
  Users,
  X,
} from "lucide-react";
import { useMediaSettingsStore } from "@/features/settings/stores/useMediaSettingsStore";
import type { Meeting } from "@/features/meetings/types/meeting";
import "./livekit.css";

interface Props {
  meeting?: Meeting;
  serverUrl?: string;
  token?: string;
  onLeave?: () => void;
  onRetry?: () => void;
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";
const trackKey = (track: TrackReferenceOrPlaceholder) =>
  `${track.participant.identity}:${track.source}`;

function Tile({
  track,
  hostId,
  featured = false,
  onSelect,
}: {
  track: TrackReferenceOrPlaceholder;
  hostId?: string;
  featured?: boolean;
  onSelect?: () => void;
}) {
  const participant = track.participant;
  const speaking = useSpeakingParticipants().some(
    (person) => person.identity === participant.identity,
  );
  const name = participant.name || participant.identity || "Participante";
  const screen = track.source === Track.Source.ScreenShare;
  return (
    <button
      type="button"
      className={`call-tile ${featured ? "call-featured" : ""} ${speaking ? "is-speaking" : ""}`}
      onClick={onSelect}
      aria-label={`Destacar a ${name}`}
    >
      {isTrackReference(track) && !track.publication.isMuted ? (
        <VideoTrack trackRef={track} className={screen ? "call-screen" : ""} />
      ) : (
        <div className="call-avatar">{initials(name)}</div>
      )}
      {speaking && <span className="call-speaking">● Hablando</span>}
      <div className="call-name">
        <span>
          {name}
          {participant.isLocal ? " (Tú)" : ""}
          {screen ? " · Pantalla" : ""}
        </span>
        {participant.identity === hostId && <small>Host</small>}
        {!participant.isMicrophoneEnabled && (
          <MicOff size={14} className="call-muted" />
        )}
      </div>
    </button>
  );
}

function Control({
  children,
  label,
  active,
  danger,
  disabled,
  onClick,
  badge,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      className={`call-control ${active ? "is-active" : ""} ${danger ? "is-danger" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
      <span>{label}</span>
      {!!badge && <b className="call-badge">{badge}</b>}
    </button>
  );
}

function RoomView({ meeting, onLeave }: Props) {
  const room = useRoomContext();
  const state = useConnectionState();
  const participants = useParticipants();
  const speakers = useSpeakingParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const {
    localParticipant,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant();
  const { messages: chatMessages } = useMeetingChat(meeting?.id);
  const isHost = Boolean(meeting?.hostId && localParticipant.identity === meeting.hostId);
  const { data: pendingRequests = [] } = usePendingAccessRequests(meeting?.id, isHost);
  const [pinned, setPinned] = useState<string>();
  const [panel, setPanel] = useState<"chat" | "people" | null>(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seen, setSeen] = useState(0);
  const [started] = useState(() => Date.now());
  const [now, setNow] = useState(started);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const featured =
    tracks.find((track) => trackKey(track) === pinned) ??
    tracks.find((track) => track.source === Track.Source.ScreenShare) ??
    tracks.find(
      (track) => track.participant.identity === speakers[0]?.identity,
    ) ??
    tracks[0];
  const rest = tracks.filter((track) => track !== featured);
  const start = meeting?.actualStartAt
    ? new Date(meeting.actualStartAt).getTime()
    : started;
  const elapsed = Math.max(
    0,
    Math.floor((now - (Number.isFinite(start) ? start : started)) / 1000),
  );
  const duration = [
    Math.floor(elapsed / 3600),
    Math.floor(elapsed / 60) % 60,
    elapsed % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
  const connected = state === ConnectionState.Connected;
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo completar la acción.",
      );
    } finally {
      setBusy(false);
    }
  };
  const togglePanel = (next: "chat" | "people") => {
    if (panel === "chat" || next === "chat") setSeen(chatMessages.length);
    setPanel(panel === next ? null : next);
  };
  return (
    <div className="call-room">
      <header className="call-header">
        <div className="call-heading">
          <i />
          <h1>{meeting?.title || room.name || "Sala de reunión"}</h1>
          <time>{duration}</time>
        </div>
        <div className="call-status">
          <span className={connected ? "live" : ""}>
            {connected
              ? "En vivo"
              : state === ConnectionState.Reconnecting ||
                  state === ConnectionState.SignalReconnecting
                ? "Reconectando…"
                : "Conectando…"}
          </span>
          <span>{participants.length} participantes</span>
        </div>
      </header>
      {error && (
        <div className="call-error" role="alert">
          {error}
          <button aria-label="Cerrar aviso" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}
      <main className="call-body">
        <div className="call-stage">
          {featured ? (
            <Tile
              track={featured}
              hostId={meeting?.hostId}
              featured
              onSelect={() => setPinned(undefined)}
            />
          ) : (
            <div className="call-empty">Conectando con la sala…</div>
          )}
        </div>
        {rest.length > 0 && (
          <aside
            className="call-filmstrip"
            aria-label="Videos de participantes"
          >
            {rest.map((track) => (
              <Tile
                key={trackKey(track)}
                track={track}
                hostId={meeting?.hostId}
                onSelect={() => setPinned(trackKey(track))}
              />
            ))}
          </aside>
        )}
        {panel === "chat" && (
          <ChatPanel
            meetingId={meeting?.id}
            hostId={meeting?.hostId}
            onClose={() => togglePanel("chat")}
          />
        )}
        {panel === "people" && (
          <aside className="call-panel">
            <header>
              <h2>Personas ({participants.length})</h2>
              <button
                onClick={() => togglePanel("people")}
                aria-label="Cerrar panel"
              >
                <X size={18} />
              </button>
            </header>
            <div className="call-people">
              {isHost && meeting?.id && (
                <section className="mb-4">
                  <PendingAccessRequestsList meetingId={meeting.id} />
                </section>
              )}
              {participants.map((person) => (
                <div key={person.identity}>
                  <span className="call-person-avatar">
                    {initials(person.name || person.identity)}
                  </span>
                  <span>
                    {person.name || person.identity}
                    {person.isLocal && " (Tú)"}
                    {person.identity === meeting?.hostId && (
                      <small>Anfitrión</small>
                    )}
                  </span>
                  {person.isMicrophoneEnabled ? (
                    <Mic size={15} />
                  ) : (
                    <MicOff size={15} className="call-muted" />
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>
      <footer className="call-toolbar">
        <div className="call-controls">
          <Control
            label={isMicrophoneEnabled ? "Silenciar" : "Activar mic."}
            active={!isMicrophoneEnabled}
            disabled={busy || !connected}
            onClick={() =>
              void run(() =>
                localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled),
              )
            }
          >
            {isMicrophoneEnabled ? <Mic /> : <MicOff />}
          </Control>
          <Control
            label={isCameraEnabled ? "Apagar cám." : "Activar cám."}
            active={!isCameraEnabled}
            disabled={busy || !connected}
            onClick={() =>
              void run(() =>
                localParticipant.setCameraEnabled(!isCameraEnabled),
              )
            }
          >
            {isCameraEnabled ? <Camera /> : <CameraOff />}
          </Control>
          <Control
            label={isScreenShareEnabled ? "Dejar de compartir" : "Compartir"}
            active={isScreenShareEnabled}
            disabled={busy || !connected}
            onClick={() =>
              void run(() =>
                localParticipant.setScreenShareEnabled(!isScreenShareEnabled),
              )
            }
          >
            <Monitor />
          </Control>
        </div>
        <div className="call-controls">
          <Control
            label="Chat"
            active={panel === "chat"}
            badge={
              panel === "chat" ? 0 : Math.max(0, chatMessages.length - seen)
            }
            onClick={() => togglePanel("chat")}
          >
            <MessageSquare />
          </Control>
          <Control
            label="Personas"
            badge={pendingRequests.length}
            active={panel === "people"}
            onClick={() => togglePanel("people")}
          >
            <Users />
          </Control>
          <div className="call-more">
            <Control label="Más" active={more} onClick={() => setMore(!more)}>
              <MoreHorizontal />
            </Control>
            {more && (
              <div className="call-menu">
                <button
                  onClick={() =>
                    void run(async () => {
                      if (document.fullscreenElement)
                        await document.exitFullscreen();
                      else await document.documentElement.requestFullscreen();
                      setMore(false);
                    })
                  }
                >
                  <Maximize size={16} /> Pantalla completa
                </button>
                <button
                  onClick={() =>
                    void run(async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                    })
                  }
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Enlace copiado" : "Copiar enlace"}
                </button>
                <button
                  onClick={() => {
                    setPinned(undefined);
                    setMore(false);
                  }}
                >
                  Seguir al hablante
                </button>
              </div>
            )}
          </div>
        </div>
        <Control
          label="Salir"
          danger
          onClick={() =>
            void run(async () => {
              await room.disconnect();
              onLeave?.();
            })
          }
        >
          <PhoneOff />
        </Control>
      </footer>
      <RoomAudioRenderer />
      <StartAudio label="Activar audio de la reunión" />
    </div>
  );
}

export default function LivekitPage({
  meeting,
  serverUrl,
  token,
  onLeave,
  onRetry,
}: Props) {
  const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;
  const media = useMediaSettingsStore();
  const [credentials, setCredentials] = useState<{
    url: string;
    token: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [withoutDevices, setWithoutDevices] = useState(false);
  const url = credentials?.url || serverUrl || livekitUrl;
  const handleError = useCallback((cause: Error) => {
    const detail = cause.message || cause.name;
    if (cause instanceof ConnectionError) {
      setError(`No se pudo conectar a LiveKit: ${detail}. Verifica que el token no haya expirado y corresponda al servidor indicado.`);
      setEnded(true);
      setCredentials(null);
    } else {
      setError(`No se pudo activar un dispositivo o publicar una pista: ${detail}. Puedes permanecer en la sala y volver a activar cámara o micrófono.`);
    }
  }, []);
  const handleDisconnected = useCallback(() => {
    setEnded(true);
    setCredentials(null);
  }, []);
  const accessToken = credentials?.token || token;
  const [options] = useState(() => ({
    adaptiveStream: true,
    dynacast: true,
    audioCaptureDefaults: { deviceId: media.selectedMic || undefined },
    videoCaptureDefaults: { deviceId: media.selectedCamera || undefined },
    audioOutput: { deviceId: media.selectedSpeaker || "default" },
  }));
  if (onRetry && (!url || !accessToken || ended)) {
    return <div className="call-entry"><div className="call-rejoin">
      <h1>{error ? "No pudimos conectarte" : "Has salido de la reunión"}</h1>
      <p role={error ? "alert" : undefined}>{error ? "No fue posible conectar con la sala. Vuelve a intentarlo para obtener un nuevo acceso." : "Puedes volver a la sala previa para ingresar nuevamente."}</p>
      <button className="call-connect" onClick={onRetry}>Volver a la sala previa</button>
      <button onClick={onLeave}>Volver a reuniones</button>
    </div></div>;
  }
  if (!url || !accessToken || ended)
    return (
      <div className="call-entry">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const address = String(data.get("url")).trim();
            try {
              const parsed = new URL(address);
              if (!["wss:", "ws:"].includes(parsed.protocol)) throw new Error();
            } catch {
              setError("Introduce una URL válida de LiveKit (wss://…).");
              return;
            }
            setError("");
            setEnded(false);
            setCredentials({
              url: address,
              token: String(data.get("token")).trim(),
            });
          }}
        >
          <span className="call-entry-icon">
            <Monitor size={28} />
          </span>
          <h1>
            {ended
              ? "Has salido de la reunión"
              : meeting?.title || "Conectar a la reunión"}
          </h1>
          <p>
            Introduce el acceso a tu sala de LiveKit. El token debe ser emitido
            por tu servidor; se utiliza únicamente en esta sesión.
          </p>
          <label>
            URL del servidor
            <input
              name="url"
              placeholder="wss://tu-proyecto.livekit.cloud"
              defaultValue={url || ""}
              required
            />
          </label>
          <label>
            Token de participante
            <input name="token" type="password" autoComplete="off" required />
          </label>
          <label style={{ flexDirection: "row", alignItems: "center" }}>
            <input type="checkbox" checked={withoutDevices} onChange={event => setWithoutDevices(event.target.checked)} />
            Entrar sin cámara ni micrófono
          </label>
          {error && (
            <p role="alert" className="call-muted">
              {error}
            </p>
          )}
          <button className="call-connect" type="submit">
            Entrar a la reunión
          </button>
          {onLeave && (
            <button type="button" onClick={onLeave}>
              Volver a reuniones
            </button>
          )}
        </form>
      </div>
    );
  return (
    <>
      <LiveKitRoom
        serverUrl={url}
        token={accessToken}
        connect
        audio={!withoutDevices && media.isMicActive}
        video={!withoutDevices && media.isCameraActive}
        options={options}
        onError={handleError}
        onDisconnected={handleDisconnected}
      >
        {error && <div className="call-error" role="alert">{error}<button aria-label="Cerrar aviso" onClick={() => setError("")}><X size={16} /></button></div>}
        <RoomView meeting={meeting} onLeave={onLeave} />
      </LiveKitRoom>
    </>
  );
}
