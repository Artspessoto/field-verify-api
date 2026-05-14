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

export type UserBodySchema = z.infer<typeof userSchema>;
