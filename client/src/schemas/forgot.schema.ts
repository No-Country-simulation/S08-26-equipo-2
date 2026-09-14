import { z } from "zod";
export const forgotSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

export type ForgotFormData = z.infer<typeof forgotSchema>;
