import z from "zod";
import { userSchema } from "./user.schema";

export const authenticateSchema = userSchema.pick({
  email: true,
  password: true,
});

export type AuthenticateBodySchema = z.infer<typeof authenticateSchema>;
