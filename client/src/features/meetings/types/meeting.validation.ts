import { z } from "zod";

export const createMeetingSchema = z
  .object({
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(150, "El título no puede exceder 150 caracteres"),
    date: z.string().min(1, "Selecciona una fecha válida"),
    time: z.string().min(1, "Selecciona una hora válida"),
    duration: z.string().min(1, "Selecciona la duración"),
    description: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (!data.date || !data.time) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // 1. Validar que la fecha no sea anterior al dia de hoy
    if (data.date < todayStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        message: "No puedes programar una reunión en una fecha pasada",
      });
      return;
    }

    // 2. Si la fecha es hoy, validar que la hora sea posterior a la actual
    if (data.date === todayStr) {
      const selectedDateTime = new Date(`${data.date}T${data.time}:00`);
      // Margen de tolerancia de 2 minutos para evitar rechazos accidentales por segundos
      const minimumAllowedTime = new Date(now.getTime() - 2 * 60 * 1000);

      if (isNaN(selectedDateTime.getTime()) || selectedDateTime < minimumAllowedTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["time"],
          message: "No puedes programar una reunión en una hora pasada",
        });
      }
    }
  });

export type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;

