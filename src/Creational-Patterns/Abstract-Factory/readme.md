# 🏭 Abstract Factory Pattern: Multi-Cloud Infrastructure Suite

## 1. 🚨 The Real Production Problem
Modern enterprise systems and SaaS applications are frequently deployed across diverse cloud providers (AWS, Google Cloud Platform, Microsoft Azure) or require seamless fallback to an on-premise/local environment during development and automated CI testing.

### What happens without Abstract Factory?
1. **Cloud Vendor Lock-In & Scattered Instantiations:**
   Application services instantiate SDK-specific classes directly throughout the codebase:
   ```typescript
   // ❌ Anti-pattern: High coupling to AWS
   const s3 = new AWS.S3();
   const sqs = new AWS.SQS();
   const cloudfront = new AWS.CloudFront();
   ```
2. **Incompatible Cross-Provider Mix-ups:**
   Without an overarching family contract, code might accidentally attempt to push an AWS S3 upload completion event to a GCP Pub/Sub topic without proper credential bridges, leading to runtime failures.
3. **Impossibility of Local Unit / Integration Testing:**
   Developers cannot run or test services locally without active AWS or GCP credentials or running expensive live infrastructure.

---

## 2. 💡 How Abstract Factory Solves It
The **Abstract Factory Pattern** provides an interface for creating **families of related or dependent objects** (such as Cloud Storage, Messaging Queues, and CDN Invalidation) without specifying their concrete classes.

### Architectural Solution:
* Define product interfaces: `ICloudStorage`, `IQueueService`, `ICDNService`.
* Define the abstract factory: `ICloudInfrastructureFactory` with methods:
  * `createStorageService(): ICloudStorage`
  * `createQueueService(): IQueueService`
  * `createCDNService(): ICDNService`
* Implement concrete factories:
  * `AWSInfrastructureFactory` (S3 + SQS + CloudFront)
  * `GCPInfrastructureFactory` (GCS + Pub/Sub + Cloud CDN)
  * `LocalInfrastructureFactory` (Local Disk + In-Memory Queue + Mock CDN)
* Switching the entire cloud environment requires changing just **one environment variable** (`CLOUD_PROVIDER=aws` or `CLOUD_PROVIDER=gcp` or `CLOUD_PROVIDER=local`).

---

## 3. 📊 Visual Diagram (Flow & Structure)

### Class Diagram
```mermaid
classDiagram
    class ICloudInfrastructureFactory {
        <<interface>>
        +createStorageService() ICloudStorage
        +createQueueService() IQueueService
        +createCDNService() ICDNService
    }

    class AWSInfrastructureFactory {
        +createStorageService() ICloudStorage
        +createQueueService() IQueueService
        +createCDNService() ICDNService
    }
    class GCPInfrastructureFactory {
        +createStorageService() ICloudStorage
        +createQueueService() IQueueService
        +createCDNService() ICDNService
    }
    class LocalInfrastructureFactory {
        +createStorageService() ICloudStorage
        +createQueueService() IQueueService
        +createCDNService() ICDNService
    }

    ICloudInfrastructureFactory <|.. AWSInfrastructureFactory
    ICloudInfrastructureFactory <|.. GCPInfrastructureFactory
    ICloudInfrastructureFactory <|.. LocalInfrastructureFactory

    class ICloudStorage {
        <<interface>>
        +uploadFile(name, buffer) Promise
        +deleteFile(id) Promise
    }
    class IQueueService {
        <<interface>>
        +publishJob(queue, payload) Promise
    }
    class ICDNService {
        <<interface>>
        +purgeCache(paths) Promise
    }

    AWSInfrastructureFactory ..> ICloudStorage : creates S3
    AWSInfrastructureFactory ..> IQueueService : creates SQS
    AWSInfrastructureFactory ..> ICDNService : creates CloudFront

    GCPInfrastructureFactory ..> ICloudStorage : creates GCS
    GCPInfrastructureFactory ..> IQueueService : creates PubSub
    GCPInfrastructureFactory ..> ICDNService : creates CloudCDN
```

### Flow Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Client as MediaProcessingController
    participant Provider as CloudFactoryProvider
    participant Factory as AWSInfrastructureFactory
    participant S3 as S3StorageService
    participant SQS as SQSQueueService
    participant CDN as CloudFrontCDNService

    Client->>Provider: getFactory("aws")
    Provider-->>Client: Returns AWSInfrastructureFactory
    Client->>Factory: createStorageService()
    Factory-->>Client: S3StorageService
    Client->>Factory: createQueueService()
    Factory-->>Client: SQSQueueService
    Client->>Factory: createCDNService()
    Factory-->>Client: CloudFrontCDNService

    Client->>S3: uploadFile("image.png", buffer)
    S3-->>Client: { fileUrl: "https://...s3.amazonaws.com/image.png" }
    Client->>SQS: publishJob("media-transcode", { fileUrl })
    SQS-->>Client: { jobId: "sqs_123" }
    Client->>CDN: purgeCache(["/images/*"])
    CDN-->>Client: { purged: true }
```

---

## 4. 💻 Code Explanation

### Core Implementation: [CloudInfrastructureFactory.ts](file:///d:/Desgin-Patterns/src/Creational-Patterns/Abstract-Factory/CloudInfrastructureFactory.ts)
1. **Families of Products:**
   Every factory (`AWS`, `GCP`, `Local`) guarantees that storage, queue, and CDN all belong to the same cloud ecosystem and adhere to common product interfaces.
2. **Environment-Driven Configuration:**
   `CloudFactoryProvider.getFactory()` reads `process.env.CLOUD_PROVIDER` or a dynamic parameter, enabling zero-code multi-cloud switching.
3. **Seamless Local Development:**
   `LocalInfrastructureFactory` enables engineers to run the full application pipeline and tests completely offline without third-party network requests.

---

## 5. 🧪 How to Test

### Prerequisites
```bash
# Build and start the server
npm run build
npm start
# Server runs on http://localhost:3000
```

### Test 1: Process Media with AWS Factory (Default)
```bash
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "fileName": "product-image.png",
    "fileContentBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

**Expected Result:** Returns `PipelineResult` with:
- `provider: "aws"`
- `pipelineResults.storage.fileUrl` pointing to `https://aws-storage.example.com/...`
- `pipelineResults.queue.jobId` starting with `aws_queue_`
- `pipelineResults.cdn.purged: true`

### Test 2: Process Media with GCP Factory
```bash
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gcp",
    "fileName": "document.pdf",
    "fileContentBase64": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."
  }'
```

**Expected Result:** Returns `PipelineResult` with GCP-specific identifiers:
- `provider: "gcp"`
- Storage URL: `https://gcp-storage.example.com/...`
- Queue jobId: `gcp_queue_...`

### Test 3: Process Media with Local Factory (No Cloud Credentials Needed)
```bash
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "local",
    "fileName": "test-image.jpg",
    "fileContentBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }'
```

**Expected Result:** Returns `PipelineResult` with local mock identifiers:
- `provider: "local"`
- Storage URL: `https://local-storage.example.com/...`
- Queue jobId: `local_queue_...`
- Works completely offline - no cloud API calls made

### Test 4: Invalid Provider (Error Handling)
```bash
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "invalid-provider",
    "fileName": "test.txt"
  }'
```

**Expected Result:** Returns `400 Bad Request` with error: `"Unknown provider: invalid-provider. Available: aws, gcp, local"`
