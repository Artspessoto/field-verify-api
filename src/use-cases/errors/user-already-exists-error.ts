import { AppError } from "~/core/errors/app-error";

export class UserAlreadyExistsError extends AppError {
  public readonly statusCode: number = 409;
  public readonly code: string = "USER_ALREADY_EXISTS";

  constructor() {
    super("E-mail already exists");
  }
}
