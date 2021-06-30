import { useQuery } from '@apollo/client';

import { eventOccurrenceQuery } from './eventQuery';

function useEventOccurrence(id: string, childId: string) {
  return useQuery(eventOccurrenceQuery, {
    variables: {
      id,
      childId,
    },
  });
}

export default useEventOccurrence;
