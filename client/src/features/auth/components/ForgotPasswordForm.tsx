import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotSchema, type ForgotFormData } from "../schemas/forgot.schema";
import Spacing from "@/components/Spacing";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const form = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      console.log("Password recovery requested for:", data.email);
      // Future recovery endpoint integration
      navigate("/auth");
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-md form p-6 shadow-[0_0_5px_#111f3a,0_0_10px_#111f3a] rounded-2xl bg-card border border-border">
      <h1 className="text-center font-extrabold text-foreground text-xl">
        Recuperar contraseña
      </h1>
      <Spacing />
      <p className="text-center text-xs text-muted-foreground">
        Ingresa tu email para recibir instrucciones de recuperación
      </p>
      <Spacing />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FieldGroup>
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

          <Link to="/auth" className="text-end text-xs text-primary hover:underline">
            Volver a iniciar sesión
          </Link>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? "Enviando..." : "Recuperar contraseña"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
