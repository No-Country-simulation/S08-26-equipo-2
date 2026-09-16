import { useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Check } from "lucide-react";
import type { ProfileFormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileSettings() {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "Ana",
      lastName: "García",
      email: "ana@empresa.com",
      role: "Product Manager",
      organization: "Empresa S.A.",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Datos de perfil actualizados:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Información personal
        </h2>
      </div>

      {/* Foto y Avatar */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center gap-5">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md select-none"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            >
              AG
            </div>
            <button
              type="button"
              title="Cambiar foto"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-md border-2 border-background"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="space-y-1">
            <p
              className="font-semibold text-foreground text-base"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Ana García
            </p>
            <p className="text-xs text-muted-foreground">ana@empresa.com</p>
            <Button
              variant="link"
              className="text-xs p-0 h-auto text-primary hover:underline cursor-pointer"
            >
              Cambiar foto de perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulario con React Hook Form y componentes Shadcn */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground">
              Nombre *
            </Label>
            <Input
              id="firstName"
              placeholder="Nombre"
              {...register("firstName", { required: "El nombre es obligatorio" })}
              className={`bg-background border-border ${errors.firstName ? "border-destructive" : ""}`}
            />
            {errors.firstName && (
              <span className="text-[11px] text-destructive">{errors.firstName.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground">
              Apellido *
            </Label>
            <Input
              id="lastName"
              placeholder="Apellido"
              {...register("lastName", { required: "El apellido es obligatorio" })}
              className={`bg-background border-border ${errors.lastName ? "border-destructive" : ""}`}
            />
            {errors.lastName && (
              <span className="text-[11px] text-destructive">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
            Correo electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico no válido",
              },
            })}
            className={`bg-background border-border ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && (
            <span className="text-[11px] text-destructive">{errors.email.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold text-muted-foreground">
              Cargo
            </Label>
            <Input
              id="role"
              placeholder="Tu cargo"
              {...register("role")}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organization" className="text-xs font-semibold text-muted-foreground">
              Organización
            </Label>
            <Input
              id="organization"
              placeholder="Tu organización"
              {...register("organization")}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" className="btn-primary text-sm px-6 py-2.5 cursor-pointer">
            Guardar cambios
          </Button>

          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-4 h-4" /> Cambios guardados correctamente
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
