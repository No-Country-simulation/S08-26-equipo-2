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

import { forgotSchema, type ForgotFormData } from "@/schemas/forgot.schema";
import Spacing from "../Spacing";
import { Link } from "react-router-dom";


export function ForgotPasswordForm() {
const navigate = useNavigate();
  const form = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),

    defaultValues: {
      email: "",
    },
  });


  const onSubmit = async (data: ForgotFormData) => {
    console.log("Email:", data);
    try {
        //comentado hasta que se tenga la api funcionando
        //const response = await loginApi(data)
        //hacer un redirect 
        //guardar la informacion (token) del usuario en Zustand o en localStorage 
        navigate("/login");
        console.log("Usuario logueado:", data);
    } catch (error) {
        //crear un toast para manejo de errores
        console.log("Error al iniciar sesión:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className=" w-full max-w-md form p-6 shadow-[0_0_5px_#111f3a,0_0_10px_#111f3a] ">
      <h1 className="text-center font-extrabold">Recuperar contraseña</h1>
      <Spacing />
      <p className="text-center text-muted-foreground">
        Ingresa tu email para recuperar tu contraseña
      </p>
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
            <Link to="/login" className="text-end text-sm text-blue-500 hover:underline">
              iniciar sesión
            </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? "Enviando..."
            : "Recuperar contraseña"}
        </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
