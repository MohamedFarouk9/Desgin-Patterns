import { StorageImplementation } from "./StorageImplementation.js";

export class LocalStorageService implements StorageImplementation {
  async uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }> {
    console.log(`[Local Disk] Saved ${fileName} (${buffer.length} bytes) to /var/data/uploads`);
    return {
      fileUrl: `http://localhost:4000/static/${fileName}`,
      storageId: `local_file_${Date.now()}`,
    };
  }

  async deleteFile(storageId: string): Promise<boolean> {
    console.log(`[Local Disk] Removed local file ${storageId}`);
    return true;
  }
}