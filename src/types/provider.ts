export type ProviderId = 'openai' | 'google' | 'zai-coding-plan';

export type ProviderAlias = ProviderId | 'codex' | 'antigravity' | 'zai' | 'z.ai' | 'chatgpt';

export type ProviderIdValues = 'openai' | 'google' | 'zai-coding-plan';

export const PROVIDERS: ProviderIdValues[] = ['openai', 'google', 'zai-coding-plan'];

export type OpenCodeAuth = Record<string, string | ProviderAuthData>;

export interface ProviderAuthData {
  type?: 'oauth' | 'api' | string;
  access?: string;
  refresh?: string;
  expires?: number;
  api_key?: string;
  token?: string;
  key?: string;
  accountId?: string;
}
