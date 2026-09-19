import { Controller } from "react-hook-form";
import { ChevronRight, RefreshCw } from "lucide-react";
import { useFormMeetings } from "../../hooks/useFormMeetings";
import { DURATION_OPTIONS, type MeetingFormProps } from "../../types/meeting";

// Componentes de Shadcn UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    onSubmit,
    isEdit,
    isPending,
  } = useFormMeetings({ initialData, onSuccess });

  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${className}`}>
      <Card className="p-6 border-border bg-card rounded-2xl shadow-xl space-y-5">
        {/* Título de la reunión */}
        <div>
          <Label
            htmlFor="title"
            className="block text-xs font-semibold mb-1.5 text-muted-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Título de la reunión *
          </Label>
          <Input
            id="title"
            placeholder="Ej. Revisión semanal del equipo"
            maxLength={150}
            className={`w-full py-2.5 px-4 text-sm bg-card border-border ${
              errors.title
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }`}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.title.message}
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
              Duración estimada
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
