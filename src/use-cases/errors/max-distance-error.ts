import { AppError } from "~/core/errors/app-error";

export class MaxDistanceError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "MAX_DISTANCE_ERROR";

  constructor() {
    super("User distance is greater than 100 meters from the merchant.");
  }
}
