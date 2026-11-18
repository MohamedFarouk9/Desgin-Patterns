import { AssetIntrinsicState } from "./AssetIntrinsicState.js";
import { AssetExtrinsicState } from "./AssetExtrinsicState.js";

export class Asset {
  private intrinsicState: AssetIntrinsicState;
  public extrinsicState: Map<string, any> = new Map();

  constructor(intrinsicState: AssetIntrinsicState) {
    this.intrinsicState = intrinsicState;
  }

  // Request method - uses intrinsic state + extrinsic state per request
  public request(requester: string, cacheLevel: string = "memory"): AssetExtrinsicState {
    const extrinsic: AssetExtrinsicState = {
      requestedBy: requester,
      requestTimestamp: new Date(),
      cacheLevel: cacheLevel as "memory" | "disk" | "cdn",
      priority: this.calculatePriority(),
    };

    // Handle caching logic using intrinsic state
    this.extrinsicState.set(requester, extrinsic);

    return extrinsic;
  }

  private calculatePriority(): number {
    // Simple priority based on file size - smaller assets get higher priority
    if (this.intrinsicState.size < 10000) return 10; // < 10KB
    if (this.intrinsicState.size < 100000) return 5; // 10KB - 100KB
    return 1; // > 100KB
  }

  public getIntrinsicState(): AssetIntrinsicState {
    return this.intrinsicState;
  }

  public getExtrinsicState(requester: string): AssetExtrinsicState | null {
    return this.extrinsicState.get(requester) || null;
  }
}