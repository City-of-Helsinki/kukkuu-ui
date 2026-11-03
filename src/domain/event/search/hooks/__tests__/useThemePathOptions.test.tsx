import { ApolloLink } from '@apollo/client';
import {
  MockedProvider,
  MockLink,
  type MockedResponse,
} from '@apollo/client/testing';
import * as Sentry from '@sentry/browser';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../../../../common/translation/i18n/i18nInit';
import { themePathsQuery } from '../../../queries/themePathsQuery';
import { useThemePathOptions } from '../useThemePathOptions';

vi.mock('@sentry/browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sentry/browser')>();
  return {
    ...actual,
    captureException: vi.fn(),
  };
});

describe('useThemePathOptions', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fi');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await i18n.changeLanguage('fi');
  });

  it('sends accept-language header matching current language and refetches with updated header when language changes', async () => {
    const receivedAcceptLanguageHeaders: Array<string | undefined> = [];

    const headerSpyLink = new ApolloLink((operation, forward) => {
      const headers = operation.getContext().headers as
        | Record<string, string>
        | undefined;
      receivedAcceptLanguageHeaders.push(headers?.['accept-language']);
      return forward(operation);
    });

    const mocks: MockedResponse[] = [
      {
        request: {
          query: themePathsQuery,
        },
        maxUsageCount: 2,
        result: {
          data: {
            themePaths: {
              edges: [
                {
                  node: {
                    __typename: 'ThemePathNode',
                    id: 'tp-1',
                    slug: 'rytmi',
                    name: 'Rytmi',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const link = ApolloLink.from([headerSpyLink, new MockLink(mocks)]);

    const { result } = renderHook(() => useThemePathOptions(), {
      wrapper: ({ children }) => (
        <MockedProvider link={link}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(receivedAcceptLanguageHeaders).toEqual(['fi']);

    await act(async () => {
      await i18n.changeLanguage('sv');
    });

    await waitFor(() => {
      expect(receivedAcceptLanguageHeaders).toEqual(['fi', 'sv']);
    });
  });

  it('shows error toast and reports to Sentry when query fails', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const queryError = new Error('Failed to fetch theme paths');

    const errorMock: MockedResponse = {
      request: {
        query: themePathsQuery,
      },
      error: queryError,
    };

    const { result } = renderHook(() => useThemePathOptions(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[errorMock]}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(i18n.t('api.errorMessage'));
    expect(Sentry.captureException).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.options).toEqual([]);
  });
});
