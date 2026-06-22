import { AppError } from "~/core/errors/app-error";

export class InvalidTokenError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "INVALID_TOKEN_ERROR";

  constructor() {
    super("Invalid token provided.");
  }
}
