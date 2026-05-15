import { AppError } from "~/core/errors/app-error";

export class InvalidCredentialsError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "INVALID_CREDENTIALS";

  constructor() {
    super("Invalid Credentials!");
  }
}
