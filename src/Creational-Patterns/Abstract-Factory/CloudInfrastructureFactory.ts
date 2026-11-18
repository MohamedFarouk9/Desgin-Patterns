// Abstract Product A: Cloud Storage Provider
export interface ICloudStorage {
  uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }>;
  deleteFile(storageId: string): Promise<boolean>;
}

// Abstract Product B: Queue & Messaging Service
export interface IQueueService {
  publishJob(queueName: string, payload: Record<string, unknown>): Promise<{ jobId: string; status: string }>;
}

// Abstract Product C: Content Delivery Network (CDN) Cache Invalidator
export interface ICDNService {
  purgeCache(paths: string[]): Promise<{ purged: boolean; timestamp: string }>;
}

// Concrete AWS Products
export class S3StorageService implements ICloudStorage {
  async uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }> {
    console.log(`[AWS S3] Uploading ${fileName} (${buffer.length} bytes) to bucket 'production-cms-assets'`);
    return {
      fileUrl: `https://production-cms-assets.s3.amazonaws.com/${fileName}`,
      storageId: `s3_arn_${Date.now()}`,
    };
  }

  async deleteFile(storageId: string): Promise<boolean> {
    console.log(`[AWS S3] Deleting object with ID: ${storageId}`);
    return true;
  }
}

export class SQSQueueService implements IQueueService {
  async publishJob(queueName: string, payload: Record<string, unknown>): Promise<{ jobId: string; status: string }> {
    console.log(`[AWS SQS] Enqueuing job to queue '${queueName}' with payload:`, JSON.stringify(payload));
    return {
      jobId: `sqs_msg_${Date.now()}`,
      status: "queued",
    };
  }
}

export class CloudFrontCDNService implements ICDNService {
  async purgeCache(paths: string[]): Promise<{ purged: boolean; timestamp: string }> {
    console.log(`[AWS CloudFront] Invalidation batch triggered for paths:`, paths);
    return {
      purged: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// Concrete GCP (Google Cloud) Products
export class GCSStorageService implements ICloudStorage {
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

export class PubSubQueueService implements IQueueService {
  async publishJob(queueName: string, payload: Record<string, unknown>): Promise<{ jobId: string; status: string }> {
    console.log(`[GCP PubSub] Publishing message to topic '${queueName}':`, JSON.stringify(payload));
    return {
      jobId: `pubsub_id_${Date.now()}`,
      status: "published",
    };
  }
}

export class CloudCDNService implements ICDNService {
  async purgeCache(paths: string[]): Promise<{ purged: boolean; timestamp: string }> {
    console.log(`[GCP Cloud CDN] Cache invalidation request executed for paths:`, paths);
    return {
      purged: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// Concrete Local / On-Premise Mock Products (for Local Dev & CI)
export class LocalDiskStorageService implements ICloudStorage {
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

export class InMemoryQueueService implements IQueueService {
  async publishJob(queueName: string, payload: Record<string, unknown>): Promise<{ jobId: string; status: string }> {
    console.log(`[In-Memory Queue] Job stored in local memory queue '${queueName}'`);
    return {
      jobId: `mem_job_${Date.now()}`,
      status: "queued",
    };
  }
}

export class NoOpCDNService implements ICDNService {
  async purgeCache(paths: string[]): Promise<{ purged: boolean; timestamp: string }> {
    console.log(`[No-Op CDN] Simulated purge for local environment:`, paths);
    return {
      purged: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// The Abstract Factory Interface: Creates a cohesive family of cloud infrastructure products
export interface ICloudInfrastructureFactory {
  createStorageService(): ICloudStorage;
  createQueueService(): IQueueService;
  createCDNService(): ICDNService;
}

// Concrete Factory 1: AWS
export class AWSInfrastructureFactory implements ICloudInfrastructureFactory {
  createStorageService(): ICloudStorage {
    return new S3StorageService();
  }
  createQueueService(): IQueueService {
    return new SQSQueueService();
  }
  createCDNService(): ICDNService {
    return new CloudFrontCDNService();
  }
}

// Concrete Factory 2: Google Cloud Platform (GCP)
export class GCPInfrastructureFactory implements ICloudInfrastructureFactory {
  createStorageService(): ICloudStorage {
    return new GCSStorageService();
  }
  createQueueService(): IQueueService {
    return new PubSubQueueService();
  }
  createCDNService(): ICDNService {
    return new CloudCDNService();
  }
}

// Concrete Factory 3: Local Dev / Testing
export class LocalInfrastructureFactory implements ICloudInfrastructureFactory {
  createStorageService(): ICloudStorage {
    return new LocalDiskStorageService();
  }
  createQueueService(): IQueueService {
    return new InMemoryQueueService();
  }
  createCDNService(): ICDNService {
    return new NoOpCDNService();
  }
}

// Provider Resolver / Provider Selection
export class CloudFactoryProvider {
  public static getFactory(providerName?: string): ICloudInfrastructureFactory {
    const selected = (providerName || process.env.CLOUD_PROVIDER || "local").toLowerCase();
    switch (selected) {
      case "aws":
        return new AWSInfrastructureFactory();
      case "gcp":
        return new GCPInfrastructureFactory();
      case "local":
      default:
        return new LocalInfrastructureFactory();
    }
  }
}
