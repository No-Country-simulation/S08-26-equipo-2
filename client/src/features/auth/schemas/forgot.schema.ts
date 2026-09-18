import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
});

export type ForgotFormData = z.infer<typeof forgotSchema>;
