import { useSearchParams } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";
import { Video } from "lucide-react";

export function AuthView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const handleToggleMode = (newMode: "login" | "signup") => {
    if (newMode === "signup") {
      setSearchParams({ mode: "signup" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8"
      style={{ background: "var(--background)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            }}
          >
            <Video className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight select-none"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              background: "linear-gradient(135deg, #fff, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MeetFlow
          </span>
        </div>

        {mode === "login" ? (
          <LoginForm onToggleMode={handleToggleMode} />
        ) : (
          <SignupForm onToggleMode={handleToggleMode} />
        )}

        <p
          className="text-center text-xs mt-4 select-none"
          style={{ color: "var(--muted-foreground)" }}
        >
          Al continuar, aceptas nuestros{" "}
          <span
            style={{ color: "var(--accent)" }}
            className="cursor-pointer hover:underline"
          >
            Términos de servicio
          </span>{" "}
          y{" "}
          <span
            style={{ color: "var(--accent)" }}
            className="cursor-pointer hover:underline"
          >
            Política de privacidad
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthView;
