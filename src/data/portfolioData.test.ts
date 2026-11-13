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

  it('uses unique badge IDs and ships each provided badge image locally', () => {
    const badgeIds = PROFILE_DATA.badges.map((badge) => badge.id);

    expect(new Set(badgeIds).size).toBe(badgeIds.length);
    for (const badge of PROFILE_DATA.badges) {
      if (!badge.badgeImage) continue;
      expect(badge.badgeImage).toMatch(/^\/assets\//);
      expect(existsSync(resolve(process.cwd(), 'public', badge.badgeImage.slice(1)))).toBe(true);
    }
  });

  it('includes all seven verified FreeAcademy AI certificates', () => {
    const certificates = PROFILE_DATA.badges.filter((badge) => badge.issuer === 'FreeAcademy AI');

    expect(certificates).toHaveLength(7);
    expect(certificates.every((badge) => badge.verifyUrl.startsWith('https://freeacademy.ai/verify/'))).toBe(true);
    expect(certificates.every((badge) => badge.keySkills.length >= 3)).toBe(true);
    for (const certificate of certificates) {
      if (!certificate.badgeImage) {
        throw new Error(`Missing certificate image for ${certificate.title}`);
      }
      expect(existsSync(resolve(process.cwd(), 'public', certificate.badgeImage.slice(1)))).toBe(true);
    }
  });
});
