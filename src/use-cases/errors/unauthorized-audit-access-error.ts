import { AppError } from "~/core/errors/app-error";

export class UnauthorizedAuditAccessError extends AppError {
  public readonly statusCode: number = 403;
  public readonly code: string = "UNAUTHORIZED_AUDIT_ACCESS";

  constructor() {
    super(
      "You do not have permission to access or modify this audit. It belongs to another agent.",
    );
  }
}
