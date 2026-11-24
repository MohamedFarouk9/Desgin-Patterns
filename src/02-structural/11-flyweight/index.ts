/**
 * Flyweight Pattern — Shared Media Asset Registry
 * Separates heavy Intrinsic State (shared binary/metadata) from lightweight Extrinsic State (per-request context).
 */
export interface SharedAsset {
  readonly key: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export class AssetFlyweightFactory {
  private static readonly pool = new Map<string, SharedAsset>();

  public static getAsset(key: string, mimeType = "image/png", sizeBytes = 45000): {
    asset: SharedAsset;
    cacheHit: boolean;
  } {
    const existing = this.pool.get(key);
    if (existing) {
      return { asset: existing, cacheHit: true };
    }
    const created: SharedAsset = Object.freeze({ key, mimeType, sizeBytes });
    this.pool.set(key, created);
    return { asset: created, cacheHit: false };
  }

  public static getStats() {
    return {
      uniqueAssetsInMemory: this.pool.size,
      keys: Array.from(this.pool.keys()),
    };
  }
}
