import type {
  ChildNode,
  EventNode,
  OccurrenceNode,
  TicketSystem,
  VenueNode,
} from '../../api/generatedTypes/graphql';

export type AvailableVenue = Pick<VenueNode, 'id' | 'name' | 'address'>;

export type AvailableOccurrence = Pick<
  OccurrenceNode,
  'id' | 'time' | 'remainingCapacity' | 'occurrenceLanguage'
> & {
  venue?: AvailableVenue | null;
};

export type AvailableEvent = Omit<
  Pick<
    EventNode,
    | 'id'
    | 'name'
    | 'shortDescription'
    | 'image'
    | 'imageAltText'
    | 'duration'
    | 'enrolmentDeniedReason'
    | 'registrationOpensAt'
  >,
  'image'
> & {
  image?: string | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
  } | null;
  occurrences: {
    edges: Array<{ node: AvailableOccurrence | null } | null>;
  };
};

export type UpcomingEventGroupNode = {
  __typename?: 'EventGroupNode';
  id: string;
  name?: string | null;
  events?: {
    edges: Array<{ node: AvailableEvent | null } | null>;
  } | null;
};

export type UpcomingEventOrGroupNode =
  | ({ __typename?: 'EventNode' } & AvailableEvent)
  | UpcomingEventGroupNode;

export type ChildAvailableOccurrencesQuery = {
  child?:
    | (Pick<ChildNode, 'id' | 'name' | 'birthyear'> & {
        availableEvents?: {
          edges: Array<{ node: AvailableEvent | null } | null>;
        } | null;
        upcomingEventsAndEventGroups?: {
          edges: Array<{ node: UpcomingEventOrGroupNode | null } | null>;
        } | null;
      })
    | null;
};

export type ChildAvailableOccurrencesQueryVariables = {
  id: string;
};
