import crypto from "crypto";
import { env } from "~/env";
import { InvalidEncryptionOrIVKeyError } from "~/use-cases/errors/invalid-encryption-or-iv-key-error";

const ENCRYPTION_KEY = env.ENCRYPTION_KEY;
const IV_KEY = env.IV_KEY;

if (ENCRYPTION_KEY.length !== 32 || IV_KEY.length !== 16) {
  throw new InvalidEncryptionOrIVKeyError();
}

export function encrypt(text: string): string {
  const iv = Buffer.from(IV_KEY);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

export function decrypt(encryptedText: string): string {
  const iv = Buffer.from(IV_KEY);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
