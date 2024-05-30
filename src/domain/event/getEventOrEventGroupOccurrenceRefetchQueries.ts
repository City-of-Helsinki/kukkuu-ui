import profileQuery from '../profile/queries/ProfileQuery';
import { childByIdQuery } from '../child/queries/ChildQueries';
import eventGroupQuery from '../eventGroup/queries/eventGroupQuery';
import { ChildEnrolmentCountDocument } from '../api/generatedTypes/graphql';

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
    { query: ChildEnrolmentCountDocument, variables: { childId } },
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
