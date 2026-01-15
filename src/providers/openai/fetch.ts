import type { ProviderResult, ProviderUsage, UsageWindow } from '../../types.ts';
import { maskSecret, type Logger, noopLogger } from '../common/logger.ts';
import { calculateResetAfterSeconds, formatDuration, formatResetAt } from '../common/time.ts';
import { getOpenaiAuth } from './auth.ts';

interface OpenaiBackendWindow {
  used_percent: number;
  limit_window_seconds: number;
  reset_after_seconds: number;
  reset_at: number;
}

interface OpenaiBackendResponse {
  plan_type: string;
  rate_limit: {
    allowed: boolean;
    limit_reached: boolean;
    primary_window?: OpenaiBackendWindow;
    secondary_window?: OpenaiBackendWindow;
  };
}

const toWindow = (window?: OpenaiBackendWindow): UsageWindow | null => {
  if (!window) {
    return null;
  }

  const usedPercent = window.used_percent;
  const resetAt = window.reset_at ? window.reset_at * 1000 : null;
  const resetAfterSeconds = window.reset_after_seconds ?? calculateResetAfterSeconds(resetAt);

  return {
    usedPercent,
    remainingPercent: Math.max(0, 100 - usedPercent),
    windowSeconds: window.limit_window_seconds ?? null,
    resetAfterSeconds,
    resetAt,
    resetAtFormatted: resetAt ? formatResetAt(resetAt) : null,
    resetAfterFormatted: resetAfterSeconds !== null ? formatDuration(resetAfterSeconds) : null,
  };
};

export const fetchOpenaiUsage = async (logger: Logger = noopLogger): Promise<ProviderResult> => {
  const auth = await getOpenaiAuth(logger);

  if (!auth) {
    await logger.warn('No auth configured for openai');
    return {
      provider: 'openai',
      ok: false,
      configured: false,
      error: 'Not configured - no OAuth token found',
      usage: null,
    };
  }

  const accessToken = auth.access ?? auth.token;
  if (!accessToken) {
    await logger.warn('Auth configured but access token missing for openai');
    return {
      provider: 'openai',
      ok: false,
      configured: false,
      error: 'Not configured - access token missing',
      usage: null,
    };
  }

  try {
    const response = await fetch('https://chatgpt.com/backend-api/wham/usage', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await logger.error(`API error ${response.status} for openai`, {
        token: maskSecret(accessToken),
      });
      return {
        provider: 'openai',
        ok: false,
        configured: true,
        error: `API error: ${response.status}`,
        usage: null,
      };
    }

    const payload = (await response.json()) as OpenaiBackendResponse;
    const primary = toWindow(payload.rate_limit.primary_window);
    const secondary = toWindow(payload.rate_limit.secondary_window);

    const windows: Record<string, UsageWindow> = {};
    if (primary) {
      windows['5h'] = primary;
    }
    if (secondary) {
      windows['weekly'] = secondary;
    }

    const usage: ProviderUsage = {
      windows,
    };

    await logger.info('openai usage fetched successfully');

    return {
      provider: 'openai',
      ok: true,
      configured: true,
      usage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logger.error(`Request failed for openai: ${message}`);
    return {
      provider: 'openai',
      ok: false,
      configured: true,
      error: `Request failed: ${message}`,
      usage: null,
    };
  }
};
