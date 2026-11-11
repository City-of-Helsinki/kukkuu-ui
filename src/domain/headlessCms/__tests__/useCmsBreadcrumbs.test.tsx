import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import TestProviders from '../../../common/test/TestProviders';
import { fakeArticle, fakePage } from '../../../utils/cmsMockDataUtils';
import useCmsBreadcrumbs from '../useCmsBreadcrumbs';

const wrapper = ({ children }: { children: ReactNode }) => (
  <TestProviders>{children}</TestProviders>
);

describe('useCmsBreadcrumbs', () => {
  it('returns default fallback breadcrumbs with Home and page title when CMS breadcrumbs are missing', () => {
    const page = fakePage({
      title: 'About us',
      hero: null,
      breadcrumbs: [],
    });

    const { result } = renderHook(() => useCmsBreadcrumbs(page), { wrapper });

    expect(result.current).toEqual([
      { title: 'Etusivu', path: '/' },
      { title: 'About us', path: null },
    ]);
  });

  it('uses fallbackTitle when page title is empty or missing', () => {
    const { result } = renderHook(
      () =>
        useCmsBreadcrumbs(null, {
          fallbackTitle: 'Events',
        }),
      { wrapper }
    );

    expect(result.current).toEqual([
      { title: 'Etusivu', path: '/' },
      { title: 'Events', path: null },
    ]);
  });

  it('inserts middleBreadcrumbs between Home and the current page item', () => {
    const article = fakeArticle({
      title: 'My Article',
      breadcrumbs: [],
    });

    const { result } = renderHook(
      () =>
        useCmsBreadcrumbs(article, {
          middleBreadcrumbs: [{ title: 'Articles Archive', path: '/fi/articles' }],
        }),
      { wrapper }
    );

    expect(result.current).toEqual([
      { title: 'Etusivu', path: '/' },
      { title: 'Articles Archive', path: '/fi/articles' },
      { title: 'My Article', path: null },
    ]);
  });

  it('uses custom fallbackBreadcrumbs when provided', () => {
    const customFallback = [
      { title: 'Root', path: '/' },
      { title: 'Custom', path: '/custom' },
    ];

    const { result } = renderHook(
      () =>
        useCmsBreadcrumbs(null, {
          fallbackBreadcrumbs: customFallback,
          disableLastLink: false,
        }),
      { wrapper }
    );

    expect(result.current).toEqual(customFallback);
  });

  it('extracts and localizes CMS breadcrumbs from page when present', () => {
    const page = fakePage({
      title: 'CMS Page',
      breadcrumbs: [
        { title: 'Etusivu CMS', uri: '/fi/', __typename: 'Breadcrumb' },
        { title: 'Tapahtumat CMS', uri: '/fi/search/', __typename: 'Breadcrumb' },
        { title: 'CMS Page', uri: '/fi/cms-page/', __typename: 'Breadcrumb' },
      ],
    });

    const { result } = renderHook(() => useCmsBreadcrumbs(page), { wrapper });

    expect(result.current).toEqual([
      { title: 'Etusivu CMS', path: '/' },
      { title: 'Tapahtumat CMS', path: '/events' },
      { title: 'CMS Page', path: null },
    ]);
  });
});
