import { AppError } from "~/core/errors/app-error";

export class UserDeactivatedError extends AppError {
  public readonly statusCode: number = 403;
  public readonly code: string = "USER_DEACTIVATED";

  constructor() {
    super(
      "This account has been deactivated. Please contact an administrator.",
    );
  }
}
