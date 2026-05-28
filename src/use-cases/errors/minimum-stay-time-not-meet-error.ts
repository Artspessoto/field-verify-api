import { AppError } from "~/core/errors/app-error";

export class MinimumStayTimeNotMetError extends AppError {
  public readonly statusCode: number = 403;
  public readonly code: string = "MINIMUM_STAY_TIME_NOT_MET";

  constructor() {
    super(
      "You must stay at the location for at least 20 minutes before submitting the audit.",
    );
  }
}
