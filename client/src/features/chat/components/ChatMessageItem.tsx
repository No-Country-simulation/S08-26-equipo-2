import type { ChatMessage } from "../types/chat.types";

interface ChatMessageItemProps {
  message: ChatMessage;
  isMe: boolean;
  isHost?: boolean;
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

export function ChatMessageItem({
  message,
  isMe,
  isHost = false,
}: ChatMessageItemProps) {
  const senderName = isMe ? "Tú" : message.sender.fullName || "Participante";
  const time = formatMessageTime(message.sentAt);

  const initials =
    message.sender.fullName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <article
      className={`rounded-xl p-3 mb-2.5 transition-colors overflow-hidden break-words text-xs ${
        isMe
          ? "bg-blue-600/15 border border-blue-500/30 ml-3"
          : "bg-[#18243b] border border-white/5 mr-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 overflow-hidden"
            style={{ background: isMe ? "#3b82f6" : "#64748b" }}
          >
            {message.sender.avatarUrl ? (
              <img
                src={message.sender.avatarUrl}
                alt={senderName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <strong
            className={`truncate font-semibold ${
              isMe ? "text-blue-300" : "text-slate-200"
            }`}
          >
            {senderName}
          </strong>
          {isHost && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-medium">
              Anfitrión
            </span>
          )}
        </div>
        <time className="shrink-0 text-[10px] text-slate-500 tabular-nums">
          {time}
        </time>
      </div>

      <p className="mt-1 text-slate-100 whitespace-pre-wrap leading-relaxed select-text text-[12px]">
        {message.message}
      </p>
    </article>
  );
}

export default ChatMessageItem;
