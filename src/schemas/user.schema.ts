import z from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .max(256, "Email must contain at most 256 characters"),
  role: z.enum(["ADMIN", "AGENT"]).default("AGENT"),
  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(16, "Password must contain at most 16 characters"),
});

export const userResponseSchema = userSchema
  .omit({
    password: true,
  })
  .extend({
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    email_verified_at: z.coerce.date().nullable(),
  });

export const updateProfileSchema = userSchema
  .pick({
    name: true,
    email: true,
  })
  .partial();

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Senha antiga é obrigatória"),
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

export const searchSchema = z.object({
  query: z.string().default(""),
  page: z.coerce.number().min(1).default(1),
  role: z.enum(["ADMIN", "AGENT"]).optional(),
});

export type UserBodySchema = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
