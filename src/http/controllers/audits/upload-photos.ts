import { FastifyReply, FastifyRequest } from "fastify";
import { auditParamsSchema, uploadPhotosSchema } from "~/schemas/audit.schema";
import { MakeGenerateUploadUrlsUseCase } from "~/use-cases/factories/audits/make-generate-upload-urls-use-case";

export async function uploadPhotos(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { audit_id } = auditParamsSchema.parse(request.params);
  const { files } = uploadPhotosSchema.parse(request.body);

  const generateUploadUrls = MakeGenerateUploadUrlsUseCase();

  const { urls } = await generateUploadUrls.execute({
    userId: request.user.sub,
    auditId: audit_id,
    files,
  });

  return reply.status(200).send({ urls });
}
