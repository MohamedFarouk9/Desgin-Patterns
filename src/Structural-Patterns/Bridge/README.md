# 🌉 Bridge Pattern: Multi-Cloud Storage Abstraction

## 1. 🚨 The Real Production Problem
Modern applications need to support multiple cloud storage providers (AWS S3, GCP Cloud Storage, Local Disk) while keeping the business logic decoupled from specific cloud SDKs. Without Bridge:

- **Tight Coupling:** Business logic directly instantiates `new AWS.S3()`, `new GCS.Bucket()`, etc.
- **Rigged Switch/If-Else Blocks:** Every storage operation requires checking the provider and calling different methods
- **Testing Nightmares:** Cannot mock cloud SDKs in unit tests without expensive mocks or live credentials
- **Vendor Lock-In:** Switching from AWS to GCP requires rewriting all storage code

## 2. 💡 How Bridge Solves It
The **Bridge Pattern** decouples an abstraction from its implementation so that the two can vary independently. It separates the "what" (abstraction - storage operations) from the "how" (implementation - specific cloud SDKs).

### Core Benefits:
* **Independence Abstraction & Implementation:** Can swap cloud providers without touching business logic
* **Avoids Explosive Class Combinations:** No need for `AWSS3Client`, `GCSBucketClient`, `AWSS3DirectClient`, etc.
* **Single Responsibility:** Each class has one reason to change (either abstraction or implementation)
* **Open/Closed Principle:** Add new implementations without modifying abstraction

## 3. 📊 Visual Diagram (Flow & Structure)

### Class Diagram
```mermaid
classDiagram
    class StorageService {
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class LocalStorageService {
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class AWSStorageService {
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class GCStorageService {
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class StorageAbstraction {
        +__storageImpl: StorageImplementation
        +setImplementation(impl: StorageImplementation): void
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class LocalStorageAbstraction {
        <<interface>>
        +uploadFile(fileName: string, buffer: Buffer): Promise~FileResult~
        +deleteFile(storageId: string): Promise~boolean~
    }

    class AWSStorageAbstraction {
        +constructFileUrl(fileUrl: string): string
    }

    LocalStorageAbstraction <|-- StorageAbstraction
    StorageAbstraction ..> LocalStorageService : uses
    StorageAbstraction ..> AWSStorageService : uses
    StorageAbstraction ..> GCStorageService : uses

    Note for StorageAbstraction "Delegates to implementation interface"
```

### Execution Flow
```mermaid
sequenceDiagram
    autonumber
    actor Client as OrderService
    participant Abstraction as StorageService
    participant Implementation as AWSStorageService
    participant S3 as AWS S3 SDK

    Client->>Abstraction: uploadFile("image.png", buffer)
    Abstraction->>Implementation: uploadFile(fileName, buffer)
    Implementation->>S3: SDK upload operation
    S3-->>Implementation: { Location, Key }
    Implementation-->>Abstraction: { fileUrl, storageId }
    Abstraction-->>Client: { success: true, fileUrl }
```

## 4. 💻 Code Implementation

### Step 1: Define Implementation Interface
```typescript
export interface StorageImplementation {
  uploadFile(fileName: string, buffer: Buffer): Promise<{ fileUrl: string; storageId: string }>;
  deleteFile(storageId: string): Promise<boolean>;
}
```

### Step 2: Implement Concrete Implementations
```typescript
// AWS Implementation
export class AWSStorageService implements StorageImplementation {
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

// GCP Implementation
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

// Local/Disk Implementation
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
```

### Step 3: Define Abstraction
```typescript
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
```

### Step 4: Refined Abstractions (Optional - add more behavior)
```typescript
export class AdvancedStorageService extends StorageService {
  async previewFile(fileName: string): Promise<string> {
    // Additional abstraction-specific logic
    return `preview-${fileName}`;
  }

  async getStorageStats(): Promise<{ totalSize: number; fileCount: number }> {
    return this.implementation.uploadFile("", new Buffer(0)); // Simplified
  }
}
```

### Usage
```typescript
// Client code - can switch implementations at runtime
const awsImpl = new AWSStorageService();
const awsStorage = new StorageService(awsImpl);

// Upload works through AWS
const result = await awsStorage.uploadFile("logo.png", buffer);

// Switch to GCP at runtime without changing StorageService
const gcpImpl = new GCStorageService();
awsStorage.setImplementation(gcpImpl);

const gcpResult = await awsStorage.uploadFile("logo.png", buffer);
```

---

## 5. 🧪 How to Test

### Prerequisites
```bash
# Build and start the server
npm run build
npm start
# Server runs on http://localhost:3000
```

### Test 1: Process Media with AWS Storage (Default)
```bash
curl -X POST http://localhost:3000/api/bridge/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "fileName": "product-image.png",
    "fileContentBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

**Expected Result:** Returns `PipelineResult` with AWS storage:
- `provider: "aws"`
- `pipelineResults.storage.fileUrl` pointing to `https://production-cms-assets.s3.amazonaws.com/...`
- `pipelineResults.storage.storageId` starting with `s3_arn_`

### Test 2: Process Media with GCP Storage
```bash
curl -X POST http://localhost:3000/api/bridge/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gcp",
    "fileName": "document.pdf",
    "fileContentBase64": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."
  }'
```

**Expected Result:** Returns `PipelineResult` with GCP storage:
- `provider: "gcp"`
- `fileUrl`: `https://storage.googleapis.com/gcp-cms-media/...`
- `storageId`: `gcs_obj_...`

### Test 3: Process Media with Local Storage (No Cloud Credentials)
```bash
curl -X POST http://localhost:3000/api/bridge/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "local",
    "fileName": "test-image.jpg",
    "fileContentBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }'
```

**Expected Result:** Returns `PipelineResult` with local storage:
- `provider: "local"`
- `fileUrl`: `http://localhost:4000/static/...`
- `storageId`: `local_file_...`
- Works completely offline - no cloud API calls made

### Test 4: Invalid Provider (Error Handling)
```bash
curl -X POST http://localhost:3000/api/bridge/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "invalid-provider",
    "fileName": "test.txt"
  }'
```

**Expected Result:** Returns `400 Bad Request` with error: `"Unknown provider: invalid-provider. Available: aws, gcp, local"`

### Test 5: Verify Runtime Implementation Switching
```bash
# The bridge pattern allows switching implementations at runtime.
# The API controller creates a new StorageService with the requested implementation each request.
# To verify, make requests with different providers and observe different URL patterns in responses.
```