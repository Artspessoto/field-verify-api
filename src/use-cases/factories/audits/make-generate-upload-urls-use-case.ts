import { S3StorageProvider } from "~/providers/s3/s3-storage-provider";
import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { GenerateUploadUrlsUseCase } from "~/use-cases/audits/generate-upload-urls/generate-upload-urls";

export function MakeGenerateUploadUrlsUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const storageProvider = new S3StorageProvider();
  const useCase = new GenerateUploadUrlsUseCase(
    auditsRepository,
    storageProvider,
  );

  return useCase;
}
