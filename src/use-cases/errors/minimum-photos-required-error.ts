import { AppError } from "~/core/errors/app-error";

export class MinimumPhotosRequiredError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "MINIMUM_PHOTOS_REQUIRED";

  constructor() {
    super(
      "You must provide at least 3 photographic evidences to complete the audit.",
    );
  }
}
