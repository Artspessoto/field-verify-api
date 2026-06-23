import { randomUUID } from "node:crypto";
import { IStorageProvider } from "../storage-provider";

interface UploadRecord {
  fileName: string;
  contentType: string;
  auditId: string;
  uploadUrl: string;
  finalUrl: string;
}

export class InMemoryStorageProvider implements IStorageProvider {
  public uploads: UploadRecord[] = [];

  async generateUpload(
    fileName: string,
    contentType: string,
    auditId: string,
  ): Promise<{ uploadUrl: string; finalUrl: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;
    const fileKey = `audits/${auditId}/${uniqueFileName}`;

    const uploadUrl = `http://fake-s3.com/upload/${fileKey}`;
    const finalUrl = `http://fake-s3.com/fieldverify-uploads/${fileKey}`;

    this.uploads.push({
      fileName,
      contentType,
      auditId,
      uploadUrl,
      finalUrl,
    });

    return { uploadUrl, finalUrl };
  }
}
