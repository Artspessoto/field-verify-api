import { AppError } from "~/core/errors/app-error";

export class MerchantAlreadyExistsError extends AppError {
  public readonly statusCode: number = 409;
  public readonly code: string = "MERCHANT_ALREADY_EXISTS";

  constructor() {
    super("Merchant with tax identification number already exists");
  }
}
