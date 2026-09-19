import { z } from "zod";

export const createMeetingSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(150, "El título no puede exceder 150 caracteres"),
  date: z.string().min(1, "Selecciona una fecha válida"),
  time: z.string().min(1, "Selecciona una hora válida"),
  duration: z.string().min(1, "Selecciona la duración"),
  description: z.string().optional().default(""),
});

export type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;

