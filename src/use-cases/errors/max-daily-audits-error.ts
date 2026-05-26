import { AppError } from "~/core/errors/app-error";

export class MaxDailyAuditsError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "MAX_DAILY_AUDITS_ERROR";

  constructor() {
    super("Agent has already performed an audit for this merchant today");
  }
}
