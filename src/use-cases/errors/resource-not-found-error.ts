import { AppError } from "~/core/errors/app-error";

export class ResourceNotFoundError extends AppError {
  public readonly statusCode: number = 404;
  public readonly code: string = "RESOURCE_NOT_FOUND";

  constructor() {
    super("Resource not found");
  }
}
