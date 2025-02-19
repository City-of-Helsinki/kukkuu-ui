import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';

import { HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE } from '../languages/constants';

export const queryPolicies = {
  languages: 'cache-only',
  language: 'cache-only',
  menu: 'cache-and-network',
} as const;

export function isConfiguredQueryPolicy(
  policy?: string
): policy is keyof typeof queryPolicies {
  if (!policy) {
    return false;
  }
  return policy in queryPolicies;
}

/**
 * Create a Apollo cache.
 */
export function createApolloCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Hardcode the languages query response, so we don't need to ever fetch it from the CMS.
          languages: {
            read() {
              return HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE['data']['languages'];
            },
          },
          // Hardcode the language query response, so we don't need to ever fetch it from the CMS.
          language: {
            read(id: string) {
              return HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE['data'][
                'languages'
              ].find((language) => language.id === id);
            },
          },
        },
      },
    },
  });
}
