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
import { accessibilitiesQuery } from '../../../queries/accessibilitiesQuery';
import { useAccessibilityOptions } from '../useAccessibilityOptions';

vi.mock('@sentry/browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sentry/browser')>();
  return {
    ...actual,
    captureException: vi.fn(),
  };
});

describe('useAccessibilityOptions', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fi');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await i18n.changeLanguage('fi');
  });

  it('fetches accessibility options with descriptions, sends accept-language header, and refetches on language change', async () => {
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
          query: accessibilitiesQuery,
        },
        maxUsageCount: 2,
        result: {
          data: {
            accessibilities: {
              edges: [
                {
                  node: {
                    __typename: 'AccessibilityNode',
                    id: 'acc-1',
                    slug: 'sensory_sensitivity',
                    name: 'Aistiherkkyys',
                    description: 'Aistiherkkyys huomioitu',
                    sortOrder: 1,
                  },
                },
                {
                  node: {
                    __typename: 'AccessibilityNode',
                    id: 'acc-2',
                    slug: 'hearing',
                    name: 'Kuulemisen tuki',
                    description: '',
                    sortOrder: 2,
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const link = ApolloLink.from([headerSpyLink, new MockLink(mocks)]);

    const { result } = renderHook(() => useAccessibilityOptions(), {
      wrapper: ({ children }) => (
        <MockedProvider link={link}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.options).toEqual([
      {
        value: 'sensory_sensitivity',
        label: 'Aistiherkkyys',
        description: 'Aistiherkkyys huomioitu',
      },
      {
        value: 'hearing',
        label: 'Kuulemisen tuki',
      },
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
    const queryError = new Error('Failed to fetch accessibilities');

    const errorMock: MockedResponse = {
      request: {
        query: accessibilitiesQuery,
      },
      error: queryError,
    };

    const { result } = renderHook(() => useAccessibilityOptions(), {
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
