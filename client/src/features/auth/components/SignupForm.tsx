import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { signupSchema, type SignupFormData } from "../schemas/signup.schema";
import GoogleButton from "./GoogleButon";
import Spacing from "@/components/Spacing";
import { LoginToggle } from "./LoginToggle";
import EmailDivition from "./EmailDivition";
import { useAuthStore } from "../store/useAuthStore";
import { AlertCircle } from "lucide-react";

export interface SignupFormProps {
  onToggleMode?: (mode: "login" | "signup") => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps = {}) {
  const navigate = useNavigate();
  const { register: registerUser, clearError } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

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
      navigate("/");
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
    <div className="w-full max-w-md form p-6 shadow-[0_0_5px_#111f3a,0_0_10px_#111f3a] rounded-2xl bg-card border border-border">
      <h1 className="text-center font-extrabold text-foreground text-2xl">
        Crear Cuenta
      </h1>
      <Spacing />
      <p className="text-center text-xs text-muted-foreground">
        Empieza gratis hoy mismo
      </p>
      <Spacing />
      <LoginToggle mode="signup" onToggle={onToggleMode} />
      <Spacing />
      <GoogleButton />
      <Spacing />
      <EmailDivition />
      <Spacing />

      {serverError && (
        <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FieldGroup>
          <Field>
            <FieldLabel className="text-muted-foreground text-xs" htmlFor="name">
              Nombre Completo
            </FieldLabel>
            <Input
              id="name"
              placeholder="Ana García"
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground text-xs" htmlFor="email">
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="anagarcia@empresa.com"
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground text-xs" htmlFor="password">
              Contraseña
            </FieldLabel>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground text-xs" htmlFor="confirmPassword">
              Confirmar Contraseña
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
