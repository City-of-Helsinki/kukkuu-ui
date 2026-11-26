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
import { occurrenceLanguagesQuery } from '../../../queries/occurrenceLanguagesQuery';
import { useOccurrenceLanguageOptions } from '../useOccurrenceLanguageOptions';

vi.mock('@sentry/browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sentry/browser')>();
  return {
    ...actual,
    captureException: vi.fn(),
  };
});

describe('useOccurrenceLanguageOptions', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fi');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await i18n.changeLanguage('fi');
  });

  it('fetches occurrence languages with lowercase alpha3Code values and refetches when language changes', async () => {
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
          query: occurrenceLanguagesQuery,
        },
        maxUsageCount: 2,
        result: {
          data: {
            languages: {
              edges: [
                {
                  node: {
                    __typename: 'LanguageNode',
                    id: 'lang-1',
                    alpha3Code: 'FIN',
                    name: 'Suomi',
                  },
                },
                {
                  node: {
                    __typename: 'LanguageNode',
                    id: 'lang-2',
                    alpha3Code: 'swe',
                    name: 'Ruotsi',
                  },
                },
                {
                  node: {
                    __typename: 'LanguageNode',
                    id: 'lang-3',
                    alpha3Code: 'zxx',
                    name: 'Sanaton',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const link = ApolloLink.from([headerSpyLink, new MockLink(mocks)]);

    const { result } = renderHook(() => useOccurrenceLanguageOptions(), {
      wrapper: ({ children }) => (
        <MockedProvider link={link}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.options).toEqual([
      { value: 'fin', label: 'Suomi' },
      { value: 'swe', label: 'Ruotsi' },
      { value: 'zxx', label: 'Sanaton' },
    ]);
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
    const queryError = new Error('Failed to fetch occurrence languages');

    const errorMock: MockedResponse = {
      request: {
        query: occurrenceLanguagesQuery,
      },
      error: queryError,
    };

    const { result } = renderHook(() => useOccurrenceLanguageOptions(), {
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
