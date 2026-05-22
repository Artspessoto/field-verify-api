import { AppError } from "~/core/errors/app-error";

export class InvalidEncryptionOrIVKeyError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "INVALID_ENCRYPTION_OR_IV_KEY";

  constructor() {
    super("The encryption key (32 bytes) or IV (16 bytes) is incorrect");
  }
}
