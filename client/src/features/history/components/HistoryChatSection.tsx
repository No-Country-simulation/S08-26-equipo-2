import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { MessageSquare, Loader2, ArrowUp, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMeetingChatHistory } from "@/features/chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HistoryChatSectionProps {
  meetingId?: string;
  hostId?: string;
  enabled?: boolean;
}

function formatMessageTime(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "";
  }
}

export function HistoryChatSection({
  meetingId,
  hostId,
  enabled = true,
}: HistoryChatSectionProps) {
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useMeetingChatHistory(meetingId, { enabled });

  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const [hasScrolledToBottomInitially, setHasScrolledToBottomInitially] = useState(false);

  // 1. Scroll inicial al fondo cuando se cargan los primeros mensajes
  useEffect(() => {
    if (!hasScrolledToBottomInitially && messages.length > 0 && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setHasScrolledToBottomInitially(true);
    }
  }, [messages.length, hasScrolledToBottomInitially]);

  // 2. Mantener la posición de scroll cuando se cargan mensajes anteriores (prepended)
  useLayoutEffect(() => {
    if (containerRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop += (newScrollHeight - prevScrollHeightRef.current);
      prevScrollHeightRef.current = 0;
    }
  }, [messages.length]);

  // 3. Cargar más automáticamente al hacer scroll hacia el tope superior
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 30 && hasNextPage && !isFetchingNextPage) {
      prevScrollHeightRef.current = target.scrollHeight;
      fetchNextPage();
    }
  };

  const handleManualFetchMore = () => {
    if (containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
    fetchNextPage();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          Historial del Chat
        </label>
        {messages.length > 0 && (
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.2 border-border text-muted-foreground font-mono"
          >
            {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"}
          </Badge>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-background/50 border border-border/70 text-xs">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Cargando mensajes del chat…</span>
          </div>
        ) : isError ? (
          <div className="py-4 text-center text-xs text-destructive space-y-2">
            <p>
              {(error as any)?.response?.data?.message ||
                "No fue posible cargar el chat de esta sesión."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs h-7 gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reintentar
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-3 text-center">
            No se registraron mensajes de chat en esta reunión.
          </p>
        ) : (
          <div className="flex flex-col">
            {/* Botón o indicador de carga al tope para mensajes anteriores */}
            {hasNextPage && (
              <div className="text-center pb-2 border-b border-border/40 mb-2">
                <button
                  type="button"
                  onClick={handleManualFetchMore}
                  disabled={isFetchingNextPage}
                  className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Cargando mensajes anteriores…
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-3 h-3" />
                      Cargar mensajes anteriores
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Contenedor scrolleable de mensajes */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="space-y-2.5 max-h-60 overflow-y-auto pr-1 select-text scroll-smooth"
            >
              {messages.map((item) => {
                const isMe = Boolean(user?.id && item.sender.id === user.id);
                const isHost = Boolean(hostId && item.sender.id === hostId);
                const senderName = isMe
                  ? "Tú"
                  : item.sender.fullName || "Participante";
                const time = formatMessageTime(item.sentAt);

                const initials =
                  item.sender.fullName
                    ?.split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "U";

                return (
                  <div
                    key={item.id}
                    className={`rounded-lg p-2.5 text-xs transition-colors ${
                      isMe
                        ? "bg-primary/10 border border-primary/20 ml-2"
                        : "bg-background/80 border border-border/60 mr-2"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 overflow-hidden"
                          style={{ background: isMe ? "#3b82f6" : "#64748b" }}
                        >
                          {item.sender.avatarUrl ? (
                            <img
                              src={item.sender.avatarUrl}
                              alt={senderName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>
                        <span
                          className={`font-semibold truncate ${
                            isMe ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {senderName}
                        </span>
                        {isHost && (
                          <span className="text-[8px] px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Host
                          </span>
                        )}
                      </div>
                      <time className="shrink-0 text-muted-foreground font-mono">
                        {time}
                      </time>
                    </div>

                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[11px] pl-5.5">
                      {item.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryChatSection;
