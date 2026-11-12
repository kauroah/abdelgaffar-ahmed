// Runtime validation coverage for the portfolio's published profile data.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROFILE_DATA } from './portfolioData';

describe('portfolio profile data', () => {
  it('includes the portfolio owner and a usable engineering headline', () => {
    expect(`${PROFILE_DATA.firstName} ${PROFILE_DATA.lastName}`).toBe('Ahmed Abdelgaffar');
    expect(PROFILE_DATA.technicalHeadline.trim().length).toBeGreaterThan(0);
  });

  it('uses unique badge IDs and ships each badge image locally', () => {
    const badgeIds = PROFILE_DATA.badges.map((badge) => badge.id);

    expect(new Set(badgeIds).size).toBe(badgeIds.length);
    for (const badge of PROFILE_DATA.badges) {
      expect(badge.badgeImage).toMatch(/^\/assets\//);
      expect(existsSync(resolve(process.cwd(), 'public', badge.badgeImage.slice(1)))).toBe(true);
    }
  });
});
