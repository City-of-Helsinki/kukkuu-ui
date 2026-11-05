import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import TestProviders from '../../../../../common/test/TestProviders';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../../utils/eventMockDataUtils';
import { eventsSearchQuery } from '../../../queries/eventsSearchQuery';
import { useEventsSearch } from '../useEventsSearch';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@sentry/browser', () => ({
  captureException: vi.fn(),
}));

const makeEventEdge = (i: number) => ({
  __typename: 'EventNodeEdge' as const,
  cursor: `cursor-${i + 1}`,
  node: {
    __typename: 'EventNode' as const,
    ...fakeAvailableEvent({
      id: `event-${i + 1}`,
      name: `Event ${i + 1}`,
      themePaths: [],
      occurrences: {
        edges: [
          {
            node: {
              __typename: 'OccurrenceNode' as const,
              ...fakeAvailableOccurrence({
                id: `occ-${i + 1}`,
                time: `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
              }),
            },
          },
        ],
      },
    }),
  },
});

describe('useEventsSearch', () => {
  const allEdges = Array.from({ length: 20 }, (_, i) => makeEventEdge(i));

  const page1Mock = {
    request: {
      query: eventsSearchQuery,
      variables: {
        childId: 'child-1',
        first: 15,
        startDate: undefined,
        languages: undefined,
        themePaths: undefined,
        accessibility: undefined,
        familyOnly: undefined,
        availableOnly: undefined,
      },
    },
    result: {
      data: {
        child: {
          __typename: 'ChildNode',
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
        },
        events: {
          __typename: 'EventsConnection',
          count: 20,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: true,
            endCursor: 'cursor-15',
          },
          edges: allEdges.slice(0, 15),
        },
      },
    },
  };

  const page2Mock = {
    request: {
      query: eventsSearchQuery,
      variables: {
        childId: 'child-1',
        first: 15,
        after: 'cursor-15',
        startDate: undefined,
        languages: undefined,
        themePaths: undefined,
        accessibility: undefined,
        familyOnly: undefined,
        availableOnly: undefined,
      },
    },
    result: {
      data: {
        child: {
          __typename: 'ChildNode',
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
        },
        events: {
          __typename: 'EventsConnection',
          count: 20,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            endCursor: 'cursor-20',
          },
          edges: allEdges.slice(15, 20),
        },
      },
    },
  };

  it('fetches first page and appends next page via fetchMore when loadMore is called', async () => {
    const { result } = renderHook(
      () =>
        useEventsSearch({
          childId: 'child-1',
        }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[page1Mock, page2Mock]}>
            {children}
          </TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCount).toBe(20);
    expect(result.current.events).toHaveLength(15);
    expect(result.current.remainingCount).toBe(5);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(20);
    });

    expect(result.current.totalCount).toBe(20);
    expect(result.current.remainingCount).toBe(0);
    expect(result.current.hasMore).toBe(false);
  });

  it('skips query execution when skip is true or childId is missing', () => {
    const { result } = renderHook(
      () => useEventsSearch({ childId: undefined, skip: true }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[]}>{children}</TestProviders>
        ),
      }
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('passes active filter arguments and ISO-converted startDate to GraphQL query', async () => {
    const filteredMock = {
      request: {
        query: eventsSearchQuery,
        variables: {
          childId: 'child-1',
          first: 15,
          startDate: '2026-11-25',
          languages: ['fi'],
          themePaths: ['rytmi'],
          accessibility: ['sensory'],
          familyOnly: true,
          availableOnly: true,
        },
      },
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 1,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'cursor-1',
            },
            edges: [allEdges[0]],
          },
        },
      },
    };

    const { result } = renderHook(
      () =>
        useEventsSearch({
          childId: 'child-1',
          filters: {
            startDate: '25.11.2026',
            languages: ['fi'],
            themePaths: ['rytmi'],
            accessibility: ['sensory'],
            familyOnly: true,
            availableOnly: true,
          },
        }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[filteredMock]}>
            {children}
          </TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].id).toBe('event-1');
  });

  it('keeps loading false during fetchMore and handles fetchMore rejection via default error handler', async () => {
    const page2ErrorMock = {
      request: page2Mock.request,
      error: new Error('Network failure on page 2'),
    };

    const { result } = renderHook(
      () =>
        useEventsSearch({
          childId: 'child-1',
        }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[page1Mock, page2ErrorMock, page2Mock]}>
            {children}
          </TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toHaveLength(15);

    act(() => {
      result.current.loadMore();
    });

    // loading must remain false during fetchMore so existing results stay mounted
    expect(result.current.loading).toBe(false);
    expect(result.current.events).toHaveLength(15);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    // Verify isFetchingMoreRef was reset in finally so a subsequent loadMore can succeed
    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(20);
    });
  });
});
