import { describe, expect, it } from 'vitest';
import type { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';

import { getIsMenuItemActive } from '../navigationUtils';

describe('getIsMenuItemActive', () => {
  const createMenuItem = (path?: string | null): MenuItem =>
    ({
      id: 'test-item',
      path,
      label: 'Test Item',
    }) as MenuItem;

  describe('frontpage menu item', () => {
    it.each([
      ['/', '/'],
      ['/', '/fi'],
      ['/', '/fi/'],
      ['/', '/sv'],
      ['/', '/en'],
      ['/fi', '/'],
      ['/fi', '/fi'],
      ['/fi/', '/fi'],
      ['/sv', '/sv'],
      ['/en', '/en'],
    ])('returns true for frontpage item "%s" on root path "%s"', (itemPath, currentPath) => {
      expect(getIsMenuItemActive(createMenuItem(itemPath), currentPath)).toBe(true);
    });

    it.each([
      ['/', '/events'],
      ['/', '/fi/events'],
      ['/', '/fi/profile'],
      ['/', '/fi/pages/about'],
      ['/fi', '/fi/articles'],
    ])('returns false for frontpage item "%s" on non-root path "%s"', (itemPath, currentPath) => {
      expect(getIsMenuItemActive(createMenuItem(itemPath), currentPath)).toBe(false);
    });
  });

  describe('semi-static pages (/events, /profile)', () => {
    it('returns true when current path exactly matches semi-static menu item', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/events')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/fi/events'), '/fi/events/')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile')).toBe(true);
    });

    it('returns true when current path is a sub-route of semi-static menu item', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events/child-123')).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile/child/123/events')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile/subscriptions')
      ).toBe(true);
    });

    it('returns false for partial non-subpath matches or unrelated paths', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events-archive')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/profile')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('/profile'), '/fi/events')).toBe(false);
    });
  });

  describe('fully dynamic CMS pages (/pages/*, /articles/*)', () => {
    it('returns true for exact CMS page matches with or without locale', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/about'), '/fi/pages/about')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/fi/pages/about'), '/fi/pages/about')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/articles'), '/fi/articles')
      ).toBe(true);
    });

    it('returns true when current path is a child page of CMS menu item', () => {
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/about'),
          '/fi/pages/about/team'
        )
      ).toBe(true);
      expect(
        getIsMenuItemActive(
          createMenuItem('/articles'),
          '/fi/articles/latest-news'
        )
      ).toBe(true);
    });

    it('returns false when current path does not match CMS menu item', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/about'), '/fi/pages/contact')
      ).toBe(false);
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/about'),
          '/fi/pages/about-extra'
        )
      ).toBe(false);
      expect(
        getIsMenuItemActive(createMenuItem('/articles'), '/fi/pages/articles')
      ).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false if menuItem path is null or undefined or empty string', () => {
      expect(getIsMenuItemActive(createMenuItem(null), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(undefined), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(''), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(null), '/')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(undefined), '/fi')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(''), '/fi/')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('   '), '/')).toBe(false);
    });

    it('handles encoded characters properly', () => {
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/kysymyksi%C3%A4'),
          '/fi/pages/kysymyksiä'
        )
      ).toBe(true);
    });
  });
});
