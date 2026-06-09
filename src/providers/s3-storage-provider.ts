import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { env } from "~/env";

export class S3StorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async generateUpload(
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; finalUrl: string }> {
    //avoid repeated names
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    const bucket = "fieldverify-uploads";

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    //10min expires
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 600,
    });

    const finalUrl = `${env.AWS_ENDPOINT_URL}/${bucket}/${uniqueFileName}`;

    return { uploadUrl, finalUrl };
  }
}
