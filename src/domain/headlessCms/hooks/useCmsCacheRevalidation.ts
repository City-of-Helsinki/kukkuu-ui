import { useEffect } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import headlessCmsClient, { revalidateStaleCmsCache } from '../client';

/**
 * Custom React hook that triggers background Stale-While-Revalidate (SWR) for CMS queries.
 *
 * Runs once on mount after child components have subscribed their active queries (navigation menu,
 * footer, front page hero). If the Apollo cache in localStorage was stale (>10m), it silently
 * refetches the active queries in the background and updates the UI in place without flashing.
 */
export function useCmsCacheRevalidation(
  client: ApolloClient<NormalizedCacheObject> = headlessCmsClient
): void {
  useEffect(() => {
    revalidateStaleCmsCache(client);
  }, [client]);
}

export default useCmsCacheRevalidation;
