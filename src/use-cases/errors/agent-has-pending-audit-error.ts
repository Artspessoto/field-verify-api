import { AppError } from "~/core/errors/app-error";

export class AgentHasPendingAuditError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = "AGENT_HAS_PENDING_AUDIT";

  constructor() {
    super(
      "Agent already has an audit in progress. Please complete it before starting a new one.",
    );
  }
}
