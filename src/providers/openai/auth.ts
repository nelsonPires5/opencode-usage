import type { Logger } from '../common/logger.ts';
import type { OpenCodeAuth, ProviderAuthData } from '../../types.ts';
import { AUTH_PATHS, loadOpenCodeAuth, readJson } from '../common/files.ts';
import { getProviderAliases } from '../common/registry.ts';

const toAuthData = (entry: OpenCodeAuth[string]): ProviderAuthData | null => {
  if (!entry) {
    return null;
  }

  if (typeof entry === 'string') {
    return { token: entry };
  }

  if (typeof entry === 'object') {
    return entry as ProviderAuthData;
  }

  return null;
};

const hasAccessToken = (auth: ProviderAuthData | null): auth is ProviderAuthData => {
  return Boolean(auth?.access || auth?.token);
};

const loadOpenCodeAuthEntry = async (logger?: Logger): Promise<ProviderAuthData | null> => {
  const auth = await loadOpenCodeAuth(logger);
  if (!auth) {
    return null;
  }

  for (const alias of getProviderAliases('openai')) {
    const entry = toAuthData(auth[alias]);
    if (entry && hasAccessToken(entry)) {
      return entry;
    }
  }

  return null;
};

export const getOpenaiAuth = async (logger?: Logger): Promise<ProviderAuthData | null> => {
  const openCodeAuth = await loadOpenCodeAuthEntry(logger);
  if (openCodeAuth && hasAccessToken(openCodeAuth)) {
    return openCodeAuth;
  }

  const pluginAuth = await readJson<ProviderAuthData>(AUTH_PATHS.openaiPlugin(), logger);
  if (pluginAuth && hasAccessToken(pluginAuth)) {
    return pluginAuth;
  }

  return null;
};
