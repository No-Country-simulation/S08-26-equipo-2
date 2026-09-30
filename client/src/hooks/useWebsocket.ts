import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.addEventListener("open", () => {
      console.log("WebSocket conectado");
      setIsConnected(true);
    });

    socket.addEventListener("message", (event) => {
      setLastMessage(event.data);
    });

    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket desconectado");
      setIsConnected(false);
    });

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}