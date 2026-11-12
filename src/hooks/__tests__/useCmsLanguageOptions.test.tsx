import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageCodeEnum } from '@city-of-helsinki/react-helsinki-headless-cms';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import TestProviders from '../../common/test/TestProviders';
import { fakePage } from '../../utils/cmsMockDataUtils';
import { useCmsLanguageOptions } from '../useCmsLanguageOptions';

describe('useCmsLanguageOptions', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('safely handles configured search context path containing regex metacharacters', async () => {
    vi.stubEnv('VITE_CMS_SEARCH_CONTEXT_PATH', '/search+events.item');
    window.history.pushState({}, '', '/events');

    const searchPage = fakePage({
      uri: '/fi/search+events.item/',
      language: { id: 'fi', code: LanguageCodeEnum.Fi, name: 'Suomi', __typename: 'Language' },
      translations: [
        {
          uri: '/en/search+events.item/',
          language: { id: 'en', code: LanguageCodeEnum.En, name: 'English', __typename: 'Language' },
          __typename: 'Page',
        },
      ],
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestProviders
        mocks={[
          {
            request: {
              query: PageDocument,
              variables: { id: 'search+events.item' },
            },
            result: {
              data: {
                page: searchPage,
              },
            },
          },
        ]}
      >
        {children}
      </TestProviders>
    );

    const { result } = renderHook(() => useCmsLanguageOptions(), { wrapper });

    await waitFor(() => {
      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uri: '/fi/events',
            locale: 'fi',
            isCurrentPage: true,
          }),
          expect.objectContaining({
            uri: '/en/events',
            locale: 'en',
            isCurrentPage: false,
          }),
        ])
      );
    });
  });
});
