import { describe, expect, it } from 'vitest';
import { filterFlagshipModels, isFlagshipModel } from './filter.js';
import type { UsageWindows } from '../types/index.js';

describe('Toast Filter', () => {
  describe('isFlagshipModel', () => {
    it('matches Claude Opus 4.5', () => {
      expect(isFlagshipModel('claude-opus-4.5')).toBe(true);
      expect(isFlagshipModel('claude-opus-4-5')).toBe(true);
      expect(isFlagshipModel('Claude Opus 4.5')).toBe(true);
    });

    it('matches Gemini 3 Pro', () => {
      expect(isFlagshipModel('gemini-3-pro')).toBe(true);
      expect(isFlagshipModel('gemini-3-pro-preview')).toBe(true);
      expect(isFlagshipModel('Gemini 3 Pro')).toBe(true);
    });

    it('matches Gemini 3 Flash', () => {
      expect(isFlagshipModel('gemini-3-flash')).toBe(true);
      expect(isFlagshipModel('gemini-3-flash-preview')).toBe(true);
      expect(isFlagshipModel('Gemini 3 Flash')).toBe(true);
    });

    it('rejects non-flagship models', () => {
      expect(isFlagshipModel('claude-sonnet')).toBe(false);
      expect(isFlagshipModel('claude-3-haiku')).toBe(false);
      expect(isFlagshipModel('gemini-2.5')).toBe(false);
      expect(isFlagshipModel('gpt-4')).toBe(false);
    });

    it('is case insensitive', () => {
      expect(isFlagshipModel('CLAUDE-OPUS-4.5')).toBe(true);
      expect(isFlagshipModel('GEMINI-3-PRO')).toBe(true);
    });
  });

  describe('filterFlagshipModels', () => {
    const mockWindow = {
      usedPercent: 50,
      remainingPercent: 50,
      windowSeconds: 18000,
      resetAfterSeconds: 3600,
      resetAt: Date.now(),
      resetAtFormatted: 'Test time',
      resetAfterFormatted: '1h',
    };

    it('filters to flagship models only', () => {
      const models: Record<string, UsageWindows> = {
        'claude-opus-4.5': { windows: { '5h': mockWindow } },
        'claude-sonnet-4.5': { windows: { '5h': mockWindow } },
        'gemini-3-pro': { windows: { '5h': mockWindow } },
        'gemini-2.5': { windows: { '5h': mockWindow } },
      };

      const filtered = filterFlagshipModels(models);

      expect(Object.keys(filtered)).toHaveLength(2);
      expect(filtered['claude-opus-4.5']).toBeDefined();
      expect(filtered['gemini-3-pro']).toBeDefined();
      expect(filtered['claude-sonnet-4.5']).toBeUndefined();
      expect(filtered['gemini-2.5']).toBeUndefined();
    });

    it('handles empty models object', () => {
      const filtered = filterFlagshipModels({});
      expect(filtered).toEqual({});
    });

    it('handles undefined models', () => {
      const filtered = filterFlagshipModels(undefined);
      expect(filtered).toEqual({});
    });

    it('filters Gemini 3 Flash', () => {
      const models: Record<string, UsageWindows> = {
        'gemini-3-flash': { windows: { '5h': mockWindow } },
        'claude-opus-4.5': { windows: { '5h': mockWindow } },
      };

      const filtered = filterFlagshipModels(models);

      expect(Object.keys(filtered)).toHaveLength(2);
      expect(filtered['gemini-3-flash']).toBeDefined();
      expect(filtered['claude-opus-4.5']).toBeDefined();
    });
  });
});
