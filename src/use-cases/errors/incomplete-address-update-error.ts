import { AppError } from "~/core/errors/app-error";

export class IncompleteAddressUpdateError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "INCOMPLETE_ADDRESS_UPDATE";

  constructor() {
    super(
      "To update your address, you must provide the new latitude and longitude.",
    );
  }
}
