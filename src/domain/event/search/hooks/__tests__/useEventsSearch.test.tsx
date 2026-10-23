import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import TestProviders from '../../../../../common/test/TestProviders';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../../utils/eventMockDataUtils';
import { childAvailableEventsQuery } from '../../../queries/childAvailableEventsQuery';
import { useEventsSearch } from '../useEventsSearch';

describe('useEventsSearch', () => {
  const eventsData = Array.from({ length: 20 }, (_, i) => ({
    node: fakeAvailableEvent({
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
          availableEvents: {
            edges: eventsData,
          },
        },
      },
    },
  };

  it('fetches events and slices items according to page and pageSize', async () => {
    const { result, rerender } = renderHook(
      ({ page, pageSize }) =>
        useEventsSearch({
          childId: 'child-1',
          page,
          pageSize,
        }),
      {
        initialProps: { page: 1, pageSize: 15 },
        wrapper: ({ children }) => (
          <TestProviders mocks={[mockQuery, mockQuery]}>
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

    rerender({ page: 2, pageSize: 15 });

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
    expect(result.current.hasMore).toBe(false);
  });
});
