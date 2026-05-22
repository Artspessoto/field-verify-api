import { AppError } from "~/core/errors/app-error";

export class DocumentAlreadyInUseError extends AppError {
  public readonly statusCode: number = 409;
  public readonly code: string = "USER_DOCUMENT_IN_USE";

  constructor() {
    super("User document already in use");
  }
}
