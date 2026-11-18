import { Asset } from "./Asset.js";
import { AssetIntrinsicState } from "./AssetIntrinsicState.js";

export class AssetRegistry {
  private static flyweights: Map<string, Asset> = new Map();

  public static getOrCreate(
    assetId: string,
    filePath: string,
    dimensions: string,
    format: string,
    size: number
  ): Asset {
    // Key is based on intrinsic state only - dimensions, format, etc.
    const key = `${assetId}:${dimensions}:${format}`;

    if (!this.flyweights.has(key)) {
      const intrinsicState: AssetIntrinsicState = {
        assetId,
        filePath,
        dimensions,
        format,
        size,
      };
      this.flyweights.set(key, new Asset(intrinsicState));
      console.log(`[Flyweight] Created new asset: ${key}`);
    }

    return this.flyweights.get(key)!;
  }

  public static get(key: string): Asset | null {
    return this.flyweights.get(key) || null;
  }

  public static getStats(): { totalUnique: number; totalExtrinsicEntries: number } {
    return {
      totalUnique: this.flyweights.size,
      totalExtrinsicEntries: Array.from(this.flyweights.values()).reduce(
        (sum, asset) => sum + asset.extrinsicState.size,
        0
      ),
    };
  }
}