import { loadEnvFile } from "node:process";
import { z } from "zod";

const currentEnv = process.env.NODE_ENV || "dev";

const envFile = `.env.${currentEnv}`;

try {
  loadEnvFile(envFile);
} catch {
  loadEnvFile(".env");
}

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  ENCRYPTION_KEY: z
    .string()
    .length(
      32,
      "The ENCRYPTION_KEY must be exactly 32 characters (bytes) long.",
    ),
  IV_KEY: z
    .string()
    .length(16, "The IV_KEY must bet exactly 16 characters (bytes) long"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required for security"),
  DATABASE_URL: z.string().nonempty(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
