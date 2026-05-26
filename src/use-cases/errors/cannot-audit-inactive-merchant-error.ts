import { AppError } from "~/core/errors/app-error";

export class CannotAuditInactiveMerchantError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "CANNOT_AUDIT_AN_INACTIVE_MERCHANT";

  constructor() {
    super("Cannot audit an inactive merchant.");
  }
}
