import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<boolean>;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  isSending = false,
  placeholder = "Escribe un mensaje…",
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || isSending) return;

    const ok = await onSendMessage(trimmed);
    if (ok) {
      setText("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 p-3 border-t border-white/10 bg-[#080d20]"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Escribir mensaje"
        className="flex-1 min-w-0 px-3 py-2 text-xs text-foreground bg-[#070d1b] border border-white/10 rounded-lg focus:outline-none focus:border-primary/60 transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled || isSending}
        className="size-8 rounded-lg flex items-center justify-center text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        title="Enviar mensaje"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}

export default ChatInput;
