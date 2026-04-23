import type { UnknownAction } from 'redux';

import { UnenrolOccurrenceMutation } from '../../api/generatedTypes/graphql';
import { saveChildEvents } from '../state/EventActions';

type UnenrolCompletedDeps = {
  dispatch: (action: UnknownAction) => void;
  refetchProfile: () => Promise<void>;
  navigateToProfile: () => void;
};

export async function handleUnenrolCompleted(
  data: UnenrolOccurrenceMutation | null | undefined,
  { dispatch, refetchProfile, navigateToProfile }: UnenrolCompletedDeps
) {
  if (data?.unenrolOccurrence?.child?.occurrences?.edges) {
    dispatch(
      saveChildEvents({
        childId: data.unenrolOccurrence.child.id,
        occurrences: data.unenrolOccurrence.child.occurrences,
      })
    );
  }

  await refetchProfile();
  navigateToProfile();
}
