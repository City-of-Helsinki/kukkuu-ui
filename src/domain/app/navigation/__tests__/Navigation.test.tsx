import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import type { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  ArticleDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import Navigation from '../Navigation';
import {
  extractMenuItems,
  getIsMenuItemActive,
  prefetchCmsMenuItems,
  scheduleIdle,
} from '../navigationUtils';
import headlessCmsClient from '../../../headlessCms/client';
import { headerMenuMock } from '../__mocks__/headerMenuMock';
import { languagesMock } from '../../footer/__mocks__/languagesMock';
import { customRender } from '../../../../common/test/customRender';

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

    it('returns false without throwing when encountering malformed percent-encoded paths', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/%E0%A4%A'), '/fi/pages/test')
      ).toBe(false);
      expect(
        getIsMenuItemActive(createMenuItem('/pages/test'), '/fi/pages/%E0%A4%A')
      ).toBe(false);
    });
  });
});

describe('<Navigation />', () => {
  it('renders skeleton pills and sets aria-busy="true" while header menu is loading', async () => {
    const delayedHeaderMock = {
      ...headerMenuMock,
      delay: 500,
    };

    const { container } = customRender(<Navigation />, [
      delayedHeaderMock,
      languagesMock,
    ]);

    const busyWrapper = container.querySelector('[aria-busy="true"]');
    expect(busyWrapper).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-skeleton')).toBeInTheDocument();
    expect(screen.getAllByTestId('nav-pill-skeleton')).toHaveLength(3);

    await waitFor(() => {
      expect(screen.getByText('Ajankohtaista')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('nav-menu-skeleton')).not.toBeInTheDocument();
    expect(busyWrapper).not.toHaveAttribute('aria-busy');
  });

  it('triggers idle prefetching for CMS menu items when menu items load', async () => {
    const querySpy = vi.spyOn(headlessCmsClient, 'query').mockResolvedValue({
      data: { page: null },
    } as never);

    customRender(<Navigation />, [headerMenuMock, languagesMock]);

    await waitFor(() => {
      expect(screen.getByText('Ajankohtaista')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(querySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          query: PageDocument,
          variables: { id: '/fi/ajankohtaista' },
          fetchPolicy: 'cache-first',
        })
      );
    });
  });
});

describe('scheduleIdle', () => {
  it('uses window.requestIdleCallback if available and cancels correctly', () => {
    const originalRequestIdle = window.requestIdleCallback;
    const originalCancelIdle = window.cancelIdleCallback;

    const requestIdleMock = vi.fn().mockReturnValue(123);
    const cancelIdleMock = vi.fn();

    window.requestIdleCallback = requestIdleMock;
    window.cancelIdleCallback = cancelIdleMock;

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(requestIdleMock).toHaveBeenCalledWith(cb);
    cancel();
    expect(cancelIdleMock).toHaveBeenCalledWith(123);

    window.requestIdleCallback = originalRequestIdle;
    window.cancelIdleCallback = originalCancelIdle;
  });

  it('safely cancels without error even if window.cancelIdleCallback is undefined', () => {
    const originalRequestIdle = window.requestIdleCallback;
    const originalCancelIdle = window.cancelIdleCallback;

    window.requestIdleCallback = vi.fn().mockReturnValue(456);
    // @ts-expect-error test missing cancel callback
    delete window.cancelIdleCallback;

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(() => cancel()).not.toThrow();

    window.requestIdleCallback = originalRequestIdle;
    window.cancelIdleCallback = originalCancelIdle;
  });

  it('falls back to setTimeout when window.requestIdleCallback is absent', () => {
    const originalRequestIdle = window.requestIdleCallback;
    // @ts-expect-error test fallback
    delete window.requestIdleCallback;

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 50);
    cancel();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    if (originalRequestIdle) {
      window.requestIdleCallback = originalRequestIdle;
    }
  });
});

describe('extractMenuItems', () => {
  it('returns empty array when items are undefined or empty', () => {
    expect(extractMenuItems(undefined)).toEqual([]);
    expect(extractMenuItems([])).toEqual([]);
  });

  it('extracts flat and nested menu items recursively with children and childItems.nodes', () => {
    const items = [
      { id: '1', path: '/page-1' },
      {
        id: '2',
        path: '/page-2',
        children: [{ id: '2-1', path: '/page-2-1' }],
      },
      {
        id: '3',
        path: '/page-3',
        childItems: {
          nodes: [{ id: '3-1', path: '/page-3-1' }],
        },
      },
    ] as unknown as MenuItem[];

    const extracted = extractMenuItems(items);
    expect(extracted.map((i) => i.id)).toEqual(['1', '2', '2-1', '3', '3-1']);
  });
});

describe('prefetchCmsMenuItems', () => {
  it('prefetches internal CMS pages with PageDocument and articles with ArticleDocument', () => {
    const mockClient = {
      query: vi.fn().mockResolvedValue({ data: null }),
    };

    const items = [
      { id: '1', path: '/ajankohtaista/' },
      { id: '2', path: '/articles/uusin-juttu' },
      { id: '3', path: '/events' }, // App route, skip
      { id: '4', path: '/profile' }, // App route, skip
      { id: '5', path: 'https://external-domain.com/something' }, // External, skip
      { id: '6', path: '/ajankohtaista/' }, // Duplicate, skip
      { id: '7', path: '/home' }, // App home route, skip
      { id: '8', path: '/search' }, // App search route, skip
      { id: '9', path: '/articles' }, // Article archive root, skip
      { id: '10', path: '/articles-info' }, // CMS page containing articles in slug, prefetch as page!
    ] as unknown as MenuItem[];

    prefetchCmsMenuItems(items, 'fi', mockClient as never);

    expect(mockClient.query).toHaveBeenCalledTimes(3);
    expect(mockClient.query).toHaveBeenCalledWith({
      query: PageDocument,
      variables: { id: '/fi/ajankohtaista' },
      fetchPolicy: 'cache-first',
    });
    expect(mockClient.query).toHaveBeenCalledWith({
      query: ArticleDocument,
      variables: { id: '/fi/uusin-juttu' },
      fetchPolicy: 'cache-first',
    });
    expect(mockClient.query).toHaveBeenCalledWith({
      query: PageDocument,
      variables: { id: '/fi/articles-info' },
      fetchPolicy: 'cache-first',
    });
  });

  it('safely catches and ignores client query rejection without throwing', () => {
    const mockClient = {
      query: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    const items = [{ id: '1', path: '/ajankohtaista/' }] as unknown as MenuItem[];

    expect(() => {
      prefetchCmsMenuItems(items, 'fi', mockClient as never);
    }).not.toThrow();
  });
});
