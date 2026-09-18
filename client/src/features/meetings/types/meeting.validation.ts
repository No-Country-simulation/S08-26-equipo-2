import { z } from "zod";

export const createMeetingSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  date: z.string().min(1, "Selecciona una fecha válida"),
  time: z.string().min(1, "Selecciona una hora válida"),
  duration: z.string().min(1, "Selecciona la duración"),
  description: z.string().optional().default(""),
  participants: z.string().optional().default(""),
  access: z.enum(["link", "invite"]).default("link"),
  approval: z.boolean().default(true),
});

export type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;
