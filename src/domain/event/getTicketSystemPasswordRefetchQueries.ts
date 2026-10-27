import eventQuery from './queries/eventQuery';
import { childAvailableEventsQuery } from './queries/childAvailableEventsQuery';
import { ProfileQueryDocument } from '../api/generatedTypes/graphql';

export type TicketSystemPasswordRefetchConfig = {
  eventId: string;
  childId: string;
};

export default function getTicketSystemPasswordRefetchQueries({
  eventId,
  childId,
}: TicketSystemPasswordRefetchConfig) {
  return [
    {
      query: eventQuery,
      variables: { id: eventId, childId },
    },
    {
      query: ProfileQueryDocument,
    },
    {
      query: childAvailableEventsQuery,
      variables: { id: childId },
    },
  ];
}
