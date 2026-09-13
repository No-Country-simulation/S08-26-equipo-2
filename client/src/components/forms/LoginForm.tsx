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

import { loginSchema, type LoginFormData } from "@/schemas/login.schema";
import GoogleButton from "./GoogleButon";
import Spacing from "../Spacing";
import { LoginToggle } from "./LoginToggle";
import EmailDivition from "./EmailDivition";
import { PasswordInput } from "../ui/password-input";
import { Link } from "react-router-dom";
import { loginApi } from "@/services/auth/authServices";

export function LoginForm() {
const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
   
    },
  });


  const onSubmit = async (data: LoginFormData) => {
    console.log("Datos del formulario:", data);
    try {
        //comentado hasta que se tenga la api funcionando
        //const response = await loginApi(data)
        //hacer un redirect 
        //guardar la informacion (token) del usuario en Zustand o en localStorage 
        navigate("/");
        console.log("Usuario logueado:", data);
    } catch (error) {
        //crear un toast para manejo de errores
        console.log("Error al iniciar sesión:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className=" w-full max-w-md form p-6 shadow-[0_0_5px_#111f3a,0_0_10px_#111f3a] ">
      <h1 className="text-center font-extrabold">Bienvenido de vuelta</h1>
      <Spacing />
      <p className="text-center text-muted-foreground">
        Ingresa tus credenciales para continuar
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
            <Link to="/forgot-password" className="text-end text-sm text-blue-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
