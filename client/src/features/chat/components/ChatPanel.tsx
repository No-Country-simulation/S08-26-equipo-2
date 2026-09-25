import { useRef, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMeetingChat } from "../hooks/useMeetingChat";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatInput } from "./ChatInput";

interface ChatPanelProps {
  meetingId?: string;
  hostId?: string;
  onClose?: () => void;
  className?: string;
}

export function ChatPanel({
  meetingId,
  hostId,
  onClose,
  className = "",
}: ChatPanelProps) {
  const { user } = useAuthStore();
  const {
    messages,
    status,
    isConnected,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    refetchHistory,
  } = useMeetingChat(meetingId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <aside
      className={`call-panel overflow-hidden shadow-2xl ${className}`}
    >
      {/* Encabezado del Panel */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#080d20]">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-foreground tracking-tight">
            Chat de la reunión
          </h2>
          {/* Indicador de conexión */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isConnected
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                : status === "connecting"
                ? "bg-amber-400 animate-pulse"
                : "bg-rose-400"
            }`}
            title={
              isConnected
                ? "Conectado al chat en tiempo real"
                : status === "connecting"
                ? "Conectando al chat…"
                : "Desconectado"
            }
          />
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de chat"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Banner de error si falla la conexión */}
      {error && (
        <div className="bg-destructive/15 border-b border-destructive/20 text-rose-300 px-3 py-2 text-[11px] flex items-center justify-between gap-2">
          <span className="truncate">{error}</span>
          <button
            type="button"
            onClick={() => refetchHistory()}
            className="text-xs underline hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
            title="Reintentar"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Contenedor de mensajes */}
      <div
        className="flex-1 overflow-y-auto p-3 min-h-0 space-y-1 select-text scroll-smooth"
        role="log"
        aria-live="polite"
      >
        {isLoadingHistory && messages.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">
            Cargando historial de mensajes…
          </div>
        )}

        {!isLoadingHistory && messages.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 leading-relaxed">
            Comienza la conversación. Los mensajes se guardan automáticamente en el historial de la reunión.
          </div>
        )}

        {messages.map((item) => (
          <ChatMessageItem
            key={item.id}
            message={item}
            isMe={Boolean(user?.id && item.sender.id === user.id)}
            isHost={Boolean(hostId && item.sender.id === hostId)}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Redactor y envío */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={!isConnected}
        isSending={isSending}
        placeholder={
          isConnected
            ? "Escribe un mensaje…"
            : "Conectando al chat…"
        }
      />
    </aside>
  );
}

export default ChatPanel;
