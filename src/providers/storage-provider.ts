export interface IStorageProvider {
  generateUpload(
    fileName: string,
    contentType: string,
    auditId: string,
  ): Promise<{ uploadUrl: string; finalUrl: string }>;
}
