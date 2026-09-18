import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import GoogleButton from "./GoogleButon";
import { LoginToggle } from "./LoginToggle";
import EmailDivition from "./EmailDivition";
import { useAuthStore } from "../store/useAuthStore";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";

export interface LoginFormProps {
  onToggleMode?: (mode: "login" | "signup") => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps = {}) {
  const navigate = useNavigate();
  const { login, clearError } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    clearError();
    try {
      await login(data);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="card p-8 glow-blue w-full">
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        Bienvenido de vuelta
      </h1>
      <p
        className="text-center text-sm mb-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        Ingresa tus credenciales para continuar
      </p>

      <LoginToggle mode="login" onToggle={onToggleMode} />
      <GoogleButton />
      <EmailDivition />

      {serverError && (
        <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                id="email"
                type="email"
                className="input w-full py-2.5 pl-9 pr-4 text-sm"
                placeholder="ana@empresa.com"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-rose-400 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="input w-full py-2.5 pl-9 pr-10 text-sm"
                placeholder="••••••••"
                {...form.register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                onClick={() => setShowPass(!showPass)}
                style={{ color: "var(--muted-foreground)" }}
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-rose-400 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-3 mb-5">
          <Link
            to="/forgot-password"
            className="text-xs hover:underline cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
