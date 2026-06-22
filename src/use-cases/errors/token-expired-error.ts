import { AppError } from "~/core/errors/app-error";

export class TokenExpiredError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "TOKEN_EXPIRED_ERROR";

  constructor() {
    super("This token has expired. Please request a new one.");
  }
}
