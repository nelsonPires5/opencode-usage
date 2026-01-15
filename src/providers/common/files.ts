import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

import type { OpenCodeAuth } from '../../types.ts';

export const xdgDataHome = (): string =>
  process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share');

export const xdgConfigHome = (): string =>
  process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config');

export const AUTH_PATHS = {
  opencode: (): string => join(xdgDataHome(), 'opencode', 'auth.json'),
  openaiPlugin: (): string => join(homedir(), '.opencode', 'auth', 'openai.json'),
  antigravityConfig: (): string => join(xdgConfigHome(), 'opencode', 'antigravity-accounts.json'),
  antigravityData: (): string => join(xdgDataHome(), 'opencode', 'antigravity-accounts.json'),
} as const;

export const readJson = async <T>(filePath: string): Promise<T | null> => {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
};

export const loadOpenCodeAuth = async (): Promise<OpenCodeAuth | null> => {
  return readJson<OpenCodeAuth>(AUTH_PATHS.opencode());
};
