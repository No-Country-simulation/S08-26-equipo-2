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
    <div className="flex w-full rounded-3xl border border-slate-700 bg-slate-900/70 p-1">
      <button
        type="button"
        onClick={() => handleToggle("login")}
        className={`flex-1 rounded-2xl px-4 py-2 text-center text-sm font-medium transition-all duration-200 cursor-pointer ${
          currentMode === "login"
            ? "bg-blue-900 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        Iniciar sesión
      </button>

      <button
        type="button"
        onClick={() => handleToggle("signup")}
        className={`flex-1 rounded-2xl px-4 py-2 text-center text-sm font-medium transition-all duration-200 cursor-pointer ${
          currentMode === "signup"
            ? "bg-blue-900 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        Registrarse
      </button>
    </div>
  );
}

export default LoginToggle;
