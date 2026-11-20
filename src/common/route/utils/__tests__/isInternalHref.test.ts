import { describe, it, expect, vi, beforeEach } from 'vitest';

import { isInternalHref, toInternalRoute } from '../isInternalHref';
import AppConfig from '../../../../domain/app/AppConfig';

describe('isInternalHref and toInternalRoute', () => {
  beforeEach(() => {
    vi.spyOn(AppConfig, 'origin', 'get').mockReturnValue('https://kukkuu.fi');
  });

  it('identifies relative routes as internal', () => {
    expect(isInternalHref('/')).toBe(true);
    expect(toInternalRoute('/')).toBe('/');

    expect(isInternalHref('/fi/events')).toBe(true);
    expect(toInternalRoute('/fi/events')).toBe('/fi/events');

    expect(isInternalHref('/events?child=123#results')).toBe(true);
    expect(toInternalRoute('/events?child=123#results')).toBe(
      '/events?child=123#results'
    );
  });

  it('identifies absolute URLs matching AppConfig.origin as internal', () => {
    expect(isInternalHref('https://kukkuu.fi/fi/pages/tietoa')).toBe(true);
    expect(toInternalRoute('https://kukkuu.fi/fi/pages/tietoa')).toBe(
      '/fi/pages/tietoa'
    );

    expect(isInternalHref('https://kukkuu.fi/events?child=456')).toBe(true);
    expect(toInternalRoute('https://kukkuu.fi/events?child=456')).toBe(
      '/events?child=456'
    );
  });

  it('rejects external URLs', () => {
    expect(isInternalHref('https://google.com')).toBe(false);
    expect(toInternalRoute('https://google.com')).toBeNull();

    expect(isInternalHref('https://hel.fi/fi')).toBe(false);
    expect(toInternalRoute('https://hel.fi/fi')).toBeNull();
  });

  it('rejects protocol-relative, hash-only, and non-navigable links', () => {
    expect(isInternalHref('//external.com')).toBe(false);
    expect(toInternalRoute('//external.com')).toBeNull();

    expect(isInternalHref('#main-content')).toBe(false);
    expect(toInternalRoute('#main-content')).toBeNull();

    expect(isInternalHref('mailto:info@kukkuu.fi')).toBe(false);
    expect(toInternalRoute('mailto:info@kukkuu.fi')).toBeNull();

    expect(isInternalHref('tel:+358401234567')).toBe(false);
    expect(toInternalRoute('tel:+358401234567')).toBeNull();

    expect(isInternalHref(null)).toBe(false);
    expect(toInternalRoute(null)).toBeNull();

    expect(isInternalHref('')).toBe(true);
    expect(toInternalRoute('')).toBe('');
  });

  it('preserves current path when resolving query-only relative hrefs', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: new URL('https://kukkuu.fi/fi/events?existing=1'),
    });

    try {
      expect(isInternalHref('?child=123')).toBe(true);
      expect(toInternalRoute('?child=123')).toBe('/fi/events?child=123');
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      });
    }
  });
});
