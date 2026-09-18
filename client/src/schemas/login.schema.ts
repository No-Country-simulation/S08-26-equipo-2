import { z } from "zod";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido"),

  password: z
    .string()
    .regex(
      passwordRegex,
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
