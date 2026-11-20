import { describe, expect, it, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import i18n from '../../common/translation/i18n/i18nInit';
import TestProviders from '../../common/test/TestProviders';
import { fakePage } from '../../utils/cmsMockDataUtils';
import usePageQuery from '../usePageQuery';

describe('usePageQuery', () => {
  afterEach(async () => {
    await i18n.changeLanguage('fi');
  });

  it('prefixes unlocalized CMS URIs with the active language', async () => {
    await i18n.changeLanguage('en');

    const englishSearchPage = fakePage({
      uri: '/en/search/',
      title: 'Find events',
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestProviders
        mocks={[
          {
            request: {
              query: PageDocument,
              variables: { id: '/en/search' },
            },
            result: {
              data: { page: englishSearchPage },
            },
          },
        ]}
      >
        {children}
      </TestProviders>
    );

    const { result } = renderHook(() => usePageQuery('/search'), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.page?.title).toBe('Find events');
    });
  });

  it('preserves and normalizes an explicit locale prefix in the URI', async () => {
    await i18n.changeLanguage('fi');

    const swedishPage = fakePage({
      uri: '/sv/pages/about/',
      title: 'Om oss',
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestProviders
        mocks={[
          {
            request: {
              query: PageDocument,
              variables: { id: '/sv/pages/about' },
            },
            result: {
              data: { page: swedishPage },
            },
          },
        ]}
      >
        {children}
      </TestProviders>
    );

    const { result } = renderHook(() => usePageQuery(' /SV/pages/about/ '), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.page?.title).toBe('Om oss');
    });
  });
});
