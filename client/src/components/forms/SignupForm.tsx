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

import { signupSchema, type SignupFormData } from "@/schemas/signup.schema";
import GoogleButton from "./GoogleButon";
import Spacing from "../Spacing";
import { LoginToggle } from "./LoginToggle";
import EmailDivition from "./EmailDivition";
import { PasswordInput } from "../ui/password-input";
// import { signupApi } from "@/services/auth/authServices";
export function SignupForm() {
  const navigate = useNavigate();
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
    try {
      //llamar a tu API 
      //const response = await signupApi(data);
      // guardar en Zustand o localStorage
     //console.log("Usuario registrado:", response);
      // redirigir 
        navigate("/");
        console.log("Usuario logueado:", data);
//bloquear el boton mientras se hace la peticion
 
    } catch (error) {
      console.error("Error:", error);
      //crear un toast para el manejo de errores o mandarlo directamente al formulario con form.setError
    }
  };

  return (
    <div className=" w-full max-w-md form p-6 shadow-[0_0_5px_#111f3a,0_0_10px_#111f3a] ">
      <h1 className="text-center font-extrabold">Crear Cuenta</h1>
      <Spacing />
      <p className="text-center text-muted-foreground">
        Empieza gratis hoy mismo
      </p>
      <Spacing />
      <LoginToggle />
      <Spacing />
      <GoogleButton />
      <Spacing />
      <EmailDivition />

      <Spacing />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
        <FieldGroup>
          <Field>
            <FieldLabel className="text-slate-500" htmlFor="name">
              Nombre
            </FieldLabel>

            <Input
              id="name"
              type="text"
              placeholder="Ana García"
              {...form.register("name")}
            />

            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel className="text-slate-500" htmlFor="email">
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
            <FieldLabel htmlFor="password" className="text-slate-500">
              Contraseña
            </FieldLabel>

            <PasswordInput
              id="password"
              placeholder="********"
              {...form.register("password")}
            />

            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword" className="text-slate-300">
              Confirmar contraseña
            </FieldLabel>

            <PasswordInput
              id="confirmPassword"
              placeholder="Repite tu contraseña"
              {...form.register("confirmPassword")}
            />

            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
