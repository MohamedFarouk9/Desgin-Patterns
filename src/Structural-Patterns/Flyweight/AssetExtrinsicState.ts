export interface AssetExtrinsicState {
  requestedBy: string;
  requestTimestamp: Date;
  cacheLevel: "memory" | "disk" | "cdn";
  priority: number;
}