import type { UsageWindows } from '../types/index.js';

const FLAGSHIP_PATTERNS: RegExp[] = [
  /claude[-\s]*opus[-\s]*4[-\s.]?5/i,
  /gemini[-\s]*3[-\s.]?pro/i,
  /gemini[-\s]*3[-\s.]?flash/i,
];

export const isFlagshipModel = (modelName: string): boolean => {
  return FLAGSHIP_PATTERNS.some((pattern) => pattern.test(modelName));
};

export const filterFlagshipModels = (
  models?: Record<string, UsageWindows>
): Record<string, UsageWindows> => {
  if (!models) {
    return {};
  }

  const filtered: Record<string, UsageWindows> = {};

  for (const [modelName, modelData] of Object.entries(models)) {
    if (isFlagshipModel(modelName)) {
      filtered[modelName] = modelData;
    }
  }

  return filtered;
};
