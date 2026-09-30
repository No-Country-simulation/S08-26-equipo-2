import { getAuthDestination } from "../getAuthDestination";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { signupSchema, type SignupFormData } from "../schemas/signup.schema";
import GoogleButton from "./GoogleButon";
import { LoginToggle } from "./LoginToggle";
import EmailDivition from "./EmailDivition";
import { useAuthStore } from "../store/useAuthStore";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";

export interface SignupFormProps {
  onToggleMode?: (mode: "login" | "signup") => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, clearError } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    clearError();
    try {
      await registerUser({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });
      navigate(getAuthDestination(location.state), { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error al registrar la cuenta. Inténtalo de nuevo.");
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
        Crear cuenta
      </h1>
      <p
        className="text-center text-sm mb-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        Empieza gratis hoy mismo
      </p>

      <LoginToggle mode="signup" onToggle={onToggleMode} />
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
              htmlFor="name"
            >
              Nombre completo
            </label>
            <input
              id="name"
              className="input w-full py-2.5 px-4 text-sm"
              placeholder="Ana García"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-rose-400 mt-1">
                {form.formState.errors.name.message}
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

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
              htmlFor="confirmPassword"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                className="input w-full py-2.5 pl-9 pr-10 text-sm"
                placeholder="••••••••"
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{ color: "var(--muted-foreground)" }}
              >
                {showConfirmPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-rose-400 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 text-sm mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
