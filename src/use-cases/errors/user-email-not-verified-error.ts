import { AppError } from "~/core/errors/app-error";

export class UserEmailNotVerifiedError extends AppError {
  public readonly statusCode: number = 403;
  public readonly code: string = "USER_EMAIL_NOT_VERIFIED";

  constructor() {
    super(
      "User email must be verified to perform this action. Please check your inbox.",
    );
  }
}
