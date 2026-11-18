export interface StorageImplementation {
  uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }>;
  deleteFile(storageId: string): Promise<boolean>;
}