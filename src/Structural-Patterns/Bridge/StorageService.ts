import { StorageImplementation } from "./StorageImplementation.js";

export class StorageService {
  private implementation: StorageImplementation;

  constructor(implementation: StorageImplementation) {
    this.implementation = implementation;
  }

  public setImplementation(implementation: StorageImplementation): void {
    this.implementation = implementation;
  }

  public async uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }> {
    return this.implementation.uploadFile(fileName, buffer);
  }

  public async deleteFile(storageId: string): Promise<boolean> {
    return this.implementation.deleteFile(storageId);
  }
}