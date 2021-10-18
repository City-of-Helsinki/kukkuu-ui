import profileQuery from '../profile/queries/ProfileQuery';
import { childByIdQuery } from '../child/queries/ChildQueries';
import eventGroupQuery from '../eventGroup/queries/eventGroupQuery';

type Config = {
  childId: string;
  eventGroupId?: string;
};

export default function getEventOrEventGroupOccurrenceRefetchQueries({
  childId,
  eventGroupId,
}: Config) {
  const sharedQueries = [
    { query: profileQuery },
    {
      query: childByIdQuery,
      variables: {
        id: childId,
      },
    },
  ];

  if (!eventGroupId) {
    return sharedQueries;
  }

  return [
    ...sharedQueries,
    {
      query: eventGroupQuery,
      variables: {
        id: eventGroupId,
        childId: childId,
      },
    },
  ];
}
