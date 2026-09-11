import { Controller } from "react-hook-form";
import { Link as LinkIcon, Users, ChevronRight, RefreshCw } from "lucide-react";
import { useFormMeetings } from "../../hooks/useFormMeetings";
import { DURATION_OPTIONS, type MeetingFormProps } from "../../types/meeting";

// Componentes de Shadcn UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MeetingForm({
  initialData,
  onSuccess,
  className = "",
}: MeetingFormProps) {
  const {
    register,
    control,
    errors,
    setValue,
    selectedAccess,
    onSubmit,
    isEdit,
    isPending,
  } = useFormMeetings({ initialData, onSuccess });

  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${className}`}>
      <Card className="p-6 border-border bg-card rounded-2xl shadow-xl space-y-5">
        {/* Nombre de la reunión */}
        <div>
          <Label
            htmlFor="name"
            className="block text-xs font-semibold mb-1.5 text-muted-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Nombre de la reunión *
          </Label>
          <Input
            id="name"
            placeholder="Ej. Revisión semanal del equipo"
            className={`w-full py-2.5 px-4 text-sm bg-card border-border ${
              errors.name
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }`}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Fecha / Hora / Duración */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Fecha */}
          <div>
            <Label
              htmlFor="date"
              className="block text-xs font-semibold mb-1.5 text-muted-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Fecha *
            </Label>
            <Input
              id="date"
              type="date"
              className={`w-full py-2.5 px-3 text-sm bg-card border-border ${
                errors.date ? "border-destructive" : ""
              }`}
              {...register("date")}
            />
            {errors.date && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Hora */}
          <div>
            <Label
              htmlFor="time"
              className="block text-xs font-semibold mb-1.5 text-muted-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Hora *
            </Label>
            <Input
              id="time"
              type="time"
              className={`w-full py-2.5 px-3 text-sm bg-card border-border ${
                errors.time ? "border-destructive" : ""
              }`}
              {...register("time")}
            />
            {errors.time && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.time.message}
              </p>
            )}
          </div>

          {/* Duración */}
          <div>
            <Label
              htmlFor="duration"
              className="block text-xs font-semibold mb-1.5 text-muted-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Duración
            </Label>
            <Controller
              control={control}
              name="duration"
              render={({ field }) => (
                <Select
                  items={DURATION_OPTIONS}
                  value={field.value}
                  onValueChange={(val) => {
                    if (val) field.onChange(val);
                  }}
                >
                  <SelectTrigger
                    id="duration"
                    className="w-full h-10 bg-card border-border"
                  >
                    <SelectValue placeholder="Selecciona duración" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <Label
            htmlFor="description"
            className="block text-xs font-semibold mb-1.5 text-muted-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Descripción
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Agenda, objetivos o notas adicionales…"
            className="w-full py-2.5 px-4 text-sm resize-none bg-card border-border"
            {...register("description")}
          />
        </div>

        {/* Invitar participantes */}
        <div>
          <Label
            htmlFor="participants"
            className="block text-xs font-semibold mb-1.5 text-muted-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Invitar participantes
          </Label>
          <Input
            id="participants"
            placeholder="correo1@empresa.com, correo2@empresa.com…"
            className="w-full py-2.5 px-4 text-sm bg-card border-border"
            {...register("participants")}
          />
          <p className="text-xs text-muted-foreground/70 mt-1">
            Separa múltiples correos electrónicos con comas.
          </p>
        </div>

        {/* Configuración de Acceso */}
        <div>
          <Label
            className="block text-xs font-semibold mb-2 text-muted-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Configuración de acceso
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                value: "link" as const,
                icon: LinkIcon,
                label: "Acceso por enlace",
                sub: "Cualquiera con el enlace puede unirse",
              },
              {
                value: "invite" as const,
                icon: Users,
                label: "Solo invitados",
                sub: "Solo participantes registrados",
              },
            ].map((o) => {
              const isSelected = selectedAccess === o.value;
              return (
                <button
                  type="button"
                  key={o.value}
                  onClick={() =>
                    setValue("access", o.value, { shouldValidate: true })
                  }
                  className={`p-4 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-primary/15 border-primary/50 text-foreground shadow-md"
                      : "bg-white/[0.02] border-border text-muted-foreground hover:bg-white/[0.04]"
                  }`}
                >
                  <o.icon
                    className={`w-4 h-4 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <p
                    className="text-xs font-semibold text-foreground"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {o.label}
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    {o.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aprobación manual con Switch de Shadcn */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/[0.02]">
          <div className="pr-4">
            <p
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Aprobación manual del anfitrión
            </p>
            <p className="text-xs mt-0.5 text-muted-foreground">
              El anfitrión debe aprobar a cada participante en sala de espera
              antes de que ingrese.
            </p>
          </div>
          <Controller
            name="approval"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {/* Botón de Enviar */}
        <Button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm cursor-pointer shadow-lg shadow-primary/20"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {isEdit ? "Guardando cambios..." : "Creando reunión..."}
            </>
          ) : (
            <>
              {isEdit ? "Guardar cambios" : "Crear reunión"}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </Card>
    </form>
  );
}

export default MeetingForm;
