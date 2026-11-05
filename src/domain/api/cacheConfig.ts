import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

import { EVENT_SEARCH_FILTER_KEYS } from '../event/search/types/filterTypes';
import type { EventsSearchQueryVariables } from '../event/types/EventsSearchTypes';

/**
 * Non-pagination filter arguments on `Query.events` used as cache keys for `relayStylePagination`
 * (excluding cursor pagination parameters `first` and `after`).
 */
export const EVENTS_PAGINATION_KEY_ARGS = [
  'childId',
  ...EVENT_SEARCH_FILTER_KEYS,
] as const satisfies readonly Exclude<
  keyof EventsSearchQueryVariables,
  'first' | 'after'
>[];

const eventsPaginationPolicy = relayStylePagination([
  ...EVENTS_PAGINATION_KEY_ARGS,
]);

/**
 * Creates a configured Apollo `InMemoryCache` instance with Relay-style cursor pagination
 * and total count preservation for `Query.events`.
 */
export const createApolloCache = () =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          events: {
            ...eventsPaginationPolicy,
            /**
             * Merges paginated `Query.events` connections while preserving the total `count` field.
             */
            merge(existing, incoming, options) {
              const merged =
                typeof eventsPaginationPolicy.merge === 'function'
                  ? eventsPaginationPolicy.merge(existing, incoming, options)
                  : incoming;
              return {
                ...merged,
                count: incoming?.count ?? existing?.count ?? 0,
              };
            },
          },
        },
      },
    },
  });
