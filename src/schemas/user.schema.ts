import { cpf } from "cpf-cnpj-validator";
import z from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must contain at least 3 characters"),
  document: z.string().refine(
    (doc) => {
      const cleanDoc = doc.replace(/\D/g, "");
      return cpf.isValid(cleanDoc);
    },
    {
      message: "Invalid document format.",
    },
  ),
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
    document: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    email_verified_at: z.coerce.date().nullable(),
  });

export const updateProfileSchema = userSchema
  .pick({
    name: true,
    email: true,
    document: true,
  })
  .partial();

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must contain at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

export const userParamsSchema = z.object({
  id: z.uuid("Invalid user ID format. It must be a valid UUID."),
});

export const searchSchema = z.object({
  query: z.string().default(""),
  page: z.coerce.number().min(1).default(1),
  role: z.enum(["ADMIN", "AGENT"]).optional(),
  is_active: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
});

export type UserBodySchema = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UserParamsSchema = z.infer<typeof userParamsSchema>;
export type SearchSchema = z.infer<typeof searchSchema>;
