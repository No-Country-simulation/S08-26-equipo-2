import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import type { ProfileFormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth";

export function ProfileSettings() {
  const user = useAuthStore((state) => state.user);

  const fullName = user?.fullName || "";
  const email = user?.email || "";

  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName,
      email,
      role: "",
      organization: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        role: "",
        organization: "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Datos de perfil actualizados:", data);
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
              {initials}
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
              {user?.fullName || "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground">{email || "Sin correo"}</p>
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
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground">
            Nombre completo *
          </Label>
          <Input
            id="fullName"
            placeholder="Nombre completo"
            {...register("fullName", { required: "El nombre completo es obligatorio" })}
            className={`bg-background border-border ${errors.fullName ? "border-destructive" : ""}`}
          />
          {errors.fullName && (
            <span className="text-[11px] text-destructive">{errors.fullName.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
              Correo electrónico
            </Label>
            <span className="text-[11px] text-muted-foreground/70">No editable</span>
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            disabled
            readOnly
            {...register("email")}
            className="bg-muted/40 border-border text-muted-foreground cursor-not-allowed opacity-75"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold text-muted-foreground">
              Cargo
            </Label>
            <Input
              id="role"
              placeholder="Ej. Product Manager"
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
              placeholder="Ej. MeetFlow Team"
              {...register("organization")}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" className="btn-primary text-sm px-6 py-2.5 cursor-pointer">
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
