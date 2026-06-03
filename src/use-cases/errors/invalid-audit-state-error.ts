import { AppError } from "~/core/errors/app-error";

export class InvalidAuditStateError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "INVALID_AUDIT_STATE";

  constructor() {
    super("Audit must be in IN_REVIEW status to be evaluated.");
  }
}
