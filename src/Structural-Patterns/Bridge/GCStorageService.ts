import { StorageImplementation } from "./StorageImplementation.js";

export class GCStorageService implements StorageImplementation {
  async uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }> {
    console.log(`[GCP Storage] Uploading ${fileName} (${buffer.length} bytes) to bucket 'gcp-cms-media'`);
    return {
      fileUrl: `https://storage.googleapis.com/gcp-cms-media/${fileName}`,
      storageId: `gcs_obj_${Date.now()}`,
    };
  }

  async deleteFile(storageId: string): Promise<boolean> {
    console.log(`[GCP Storage] Deleting object with ID: ${storageId}`);
    return true;
  }
}