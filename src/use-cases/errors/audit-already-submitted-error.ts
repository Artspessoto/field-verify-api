import { AppError } from "~/core/errors/app-error";

export class AuditAlreadySubmittedError extends AppError {
  public readonly statusCode: number = 409;
  public readonly code: string = "AUDIT_ALREADY_SUBMITTED";

  constructor() {
    super(
      "This audit has already been submitted and its state cannot be modified.",
    );
  }
}
