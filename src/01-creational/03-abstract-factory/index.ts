/**
 * Abstract Factory Pattern — Multi-Cloud Infrastructure Suite
 * Creates cohesive families of cloud services (Storage + Queue + CDN) for AWS, GCP, or Local dev.
 */
export interface CloudStorage {
  upload(fileName: string, sizeBytes: number): Promise<{ url: string; id: string }>;
}

export interface CloudQueue {
  publish(topic: string, payload: Record<string, unknown>): Promise<{ jobId: string }>;
}

export interface CloudCDN {
  purge(paths: string[]): Promise<{ purged: boolean }>;
}

export interface CloudFactory {
  createStorage(): CloudStorage;
  createQueue(): CloudQueue;
  createCDN(): CloudCDN;
}

// --- AWS Family ---
class S3Storage implements CloudStorage {
  async upload(fileName: string) {
    return { url: `https://prod-bucket.s3.amazonaws.com/${fileName}`, id: `s3_${Date.now()}` };
  }
}
class SQSQueue implements CloudQueue {
  async publish(topic: string) {
    return { jobId: `sqs_${topic}_${Date.now()}` };
  }
}
class CloudFrontCDN implements CloudCDN {
  async purge(_paths: string[]) {
    return { purged: true };
  }
}
export class AWSFactory implements CloudFactory {
  createStorage(): CloudStorage { return new S3Storage(); }
  createQueue(): CloudQueue { return new SQSQueue(); }
  createCDN(): CloudCDN { return new CloudFrontCDN(); }
}

// --- GCP Family ---
class GCSStorage implements CloudStorage {
  async upload(fileName: string) {
    return { url: `https://storage.googleapis.com/prod-media/${fileName}`, id: `gcs_${Date.now()}` };
  }
}
class PubSubQueue implements CloudQueue {
  async publish(topic: string) {
    return { jobId: `pubsub_${topic}_${Date.now()}` };
  }
}
class GCPCloudCDN implements CloudCDN {
  async purge(_paths: string[]) {
    return { purged: true };
  }
}
export class GCPFactory implements CloudFactory {
  createStorage(): CloudStorage { return new GCSStorage(); }
  createQueue(): CloudQueue { return new PubSubQueue(); }
  createCDN(): CloudCDN { return new GCPCloudCDN(); }
}

// --- Local Dev / CI Family ---
class LocalStorage implements CloudStorage {
  async upload(fileName: string) {
    return { url: `http://localhost:3000/uploads/${fileName}`, id: `local_${Date.now()}` };
  }
}
class MemoryQueue implements CloudQueue {
  async publish(topic: string) {
    return { jobId: `mem_${topic}_${Date.now()}` };
  }
}
class MockCDN implements CloudCDN {
  async purge(_paths: string[]) {
    return { purged: true };
  }
}
export class LocalFactory implements CloudFactory {
  createStorage(): CloudStorage { return new LocalStorage(); }
  createQueue(): CloudQueue { return new MemoryQueue(); }
  createCDN(): CloudCDN { return new MockCDN(); }
}

export function getCloudFactory(provider = "local"): CloudFactory {
  switch (provider.toLowerCase()) {
    case "aws": return new AWSFactory();
    case "gcp": return new GCPFactory();
    case "local": return new LocalFactory();
    default: throw new Error(`Unknown cloud provider "${provider}". Use: aws, gcp, local`);
  }
}
