import { useSearchParams } from "react-router-dom";

export interface LoginToggleProps {
  mode?: "login" | "signup";
  onToggle?: (mode: "login" | "signup") => void;
}

export function LoginToggle({ mode, onToggle }: LoginToggleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMode =
    mode || (searchParams.get("mode") === "signup" ? "signup" : "login");

  const handleToggle = (newMode: "login" | "signup") => {
    if (onToggle) {
      onToggle(newMode);
    } else {
      setSearchParams(newMode === "signup" ? { mode: "signup" } : {});
    }
  };

  return (
    <div
      className="flex w-full mb-6 p-1 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        onClick={() => handleToggle("login")}
        className="flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          background: currentMode === "login" ? "rgba(59,130,246,0.2)" : "transparent",
          color: currentMode === "login" ? "#93c5fd" : "var(--muted-foreground)",
          border: currentMode === "login" ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
        }}
      >
        Iniciar sesión
      </button>

      <button
        type="button"
        onClick={() => handleToggle("signup")}
        className="flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          background: currentMode === "signup" ? "rgba(59,130,246,0.2)" : "transparent",
          color: currentMode === "signup" ? "#93c5fd" : "var(--muted-foreground)",
          border: currentMode === "signup" ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
        }}
      >
        Registrarse
      </button>
    </div>
  );
}

export default LoginToggle;
