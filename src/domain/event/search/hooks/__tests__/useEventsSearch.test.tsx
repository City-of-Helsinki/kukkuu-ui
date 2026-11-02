import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import TestProviders from '../../../../../common/test/TestProviders';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../../utils/eventMockDataUtils';
import { childAvailableEventsQuery } from '../../../queries/childAvailableEventsQuery';
import { useEventsSearch } from '../useEventsSearch';

describe('useEventsSearch', () => {
  const eventsData = Array.from({ length: 20 }, (_, i) => ({
    node: {
      __typename: 'EventNode' as const,
      ...fakeAvailableEvent({
        id: `event-${i + 1}`,
        name: `Event ${i + 1}`,
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: `occ-${i + 1}`,
                time: `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
              }),
            },
          ],
        },
      }),
    },
  }));

  const mockQuery = {
    request: {
      query: childAvailableEventsQuery,
      variables: { id: 'child-1' },
    },
    result: {
      data: {
        child: {
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
          themePath: null,
          upcomingEventsAndEventGroups: {
            edges: eventsData,
          },
        },
      },
    },
  };

  it('paginates events according to pageSize and supports loadMore', async () => {
    const { result } = renderHook(
      () =>
        useEventsSearch({
          childId: 'child-1',
        }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[mockQuery]}>
            {children}
          </TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCount).toBe(20);
    // Initial page shows default page size 15
    expect(result.current.events).toHaveLength(15);
    expect(result.current.remainingCount).toBe(5);
    expect(result.current.hasMore).toBe(true);

    // Calling loadMore displays the remaining 5 items
    act(() => {
      result.current.loadMore();
    });

    expect(result.current.events).toHaveLength(20);
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

  it('filters to available-only events when availableOnly is true and excludes enrolled events', async () => {
    const mockFilterQuery = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
            upcomingEventsAndEventGroups: {
              edges: [
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...fakeAvailableEvent({
                      id: 'ev-1',
                      enrolmentDeniedReason: null,
                    }),
                  },
                },
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...fakeAvailableEvent({
                      id: 'ev-2',
                      enrolmentDeniedReason: 'ALREADY_JOINED_EVENT_GROUP' as any,
                    }),
                  },
                },
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...fakeAvailableEvent({
                      id: 'ev-3',
                      enrolmentDeniedReason: null,
                    }),
                  },
                },
              ],
            },
          },
        },
      },
    };

    const { result } = renderHook(
      () =>
        useEventsSearch({
          childId: 'child-1',
          availableOnly: true,
          enrolledEventIds: new Set(['ev-3']),
        }),
      {
        wrapper: ({ children }) => (
          <TestProviders mocks={[mockFilterQuery]}>
            {children}
          </TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // ev-2 has reason ALREADY_JOINED_EVENT_GROUP, ev-3 is enrolled -> only ev-1 remains
    expect(result.current.totalCount).toBe(1);
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].id).toBe('ev-1');
  });
});
