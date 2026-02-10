import { FeedAdapter } from "../types";
import { KicksDBAdapter } from "./kicksdb";

const adapterRegistry: Record<string, () => FeedAdapter> = {
  kicksdb: () => new KicksDBAdapter(),
  // Phase 2 adapters will be registered here:
  // cj: () => new CJAdapter(),
  // rakuten: () => new RakutenAdapter(),
  // impact: () => new ImpactAdapter(),
};

export function getAdapter(adapterType: string): FeedAdapter | null {
  const factory = adapterRegistry[adapterType];
  return factory ? factory() : null;
}

export function getRegisteredAdapterTypes(): string[] {
  return Object.keys(adapterRegistry);
}
