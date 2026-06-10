import { IStorageProvider } from "~/providers/storage-provider";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { InvalidAuditStateError } from "~/use-cases/errors/invalid-audit-state-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { UnauthorizedAuditAccessError } from "~/use-cases/errors/unauthorized-audit-access-error";

interface FileRequest {
  fileName: string;
  contentType: string;
}

interface FileResponse {
  uploadUrl: string;
  finalUrl: string;
}

export interface IGenerateUploadUrlsUseCaseReq {
  userId: string;
  auditId: string;
  files: FileRequest[];
}

export class GenerateUploadUrlsUseCase {
  constructor(
    private auditsRepository: IAuditsRepository,
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    userId,
    auditId,
    files,
  }: IGenerateUploadUrlsUseCaseReq): Promise<{ urls: FileResponse[] }> {
    const audit = await this.auditsRepository.findById(auditId);

    if (!audit) throw new ResourceNotFoundError();
    if (audit.user_id !== userId) throw new UnauthorizedAuditAccessError();
    if (audit.status !== "PENDING") throw new InvalidAuditStateError();

    const urlsData = await Promise.all(
      files.map((file) =>
        this.storageProvider.generateUpload(
          file.fileName,
          file.contentType,
          auditId,
        ),
      ),
    );

    return { urls: urlsData };
  }
}
