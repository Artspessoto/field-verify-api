import { AppError } from "~/core/errors/app-error";

export class AuditNotEvaluatedError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "AUDIT_NOT_EVALUATED";

  constructor() {
    super("Cannot override an audit that hasn't been evaluated yet.");
  }
}
