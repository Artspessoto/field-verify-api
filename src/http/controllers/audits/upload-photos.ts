import { FastifyReply, FastifyRequest } from "fastify";
import { S3StorageProvider } from "~/providers/s3-storage-provider";
import { auditParamsSchema, uploadPhotosSchema } from "~/schemas/audit.schema";

export async function uploadPhotos(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { audit_id } = auditParamsSchema.parse(request.params);
  const { files } = uploadPhotosSchema.parse(request.body);

  const storageProvider = new S3StorageProvider();

  const urlsData = await Promise.all(
    files.map((file) =>
      storageProvider.generateUpload(file.fileName, file.contentType, audit_id),
    ),
  );

  return reply.status(200).send({ urls: urlsData });
}
