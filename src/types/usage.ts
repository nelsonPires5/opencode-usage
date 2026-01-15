import type { ProviderId } from './provider.ts';

export interface UsageWindow {
  usedPercent: number | null;
  remainingPercent: number | null;
  windowSeconds: number | null;
  resetAfterSeconds: number | null;
  resetAt: number | null;
  resetAtFormatted: string | null;
  resetAfterFormatted: string | null;
}

export interface UsageWindows {
  windows: Record<string, UsageWindow>;
}

export interface ProviderUsage extends UsageWindows {
  models?: Record<string, UsageWindows>;
}

export interface ProviderResult {
  provider: ProviderId;
  ok: boolean;
  configured: boolean;
  error?: string;
  usage: ProviderUsage | null;
}
