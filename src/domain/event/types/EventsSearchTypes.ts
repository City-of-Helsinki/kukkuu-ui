import type {
  ChildNode,
  EventNode,
  EventParticipantsPerInvite,
  OccurrenceNode,
  TicketSystem,
  VenueNode,
} from '../../api/generatedTypes/graphql';

export type AvailableVenue = Pick<
  VenueNode,
  '__typename' | 'id' | 'name' | 'address'
>;

export type AvailableOccurrence = Pick<
  OccurrenceNode,
  '__typename' | 'id' | 'time' | 'remainingCapacity' | 'occurrenceLanguage'
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
  participantsPerInvite?: EventParticipantsPerInvite | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
    hasAnyFreePasswords?: boolean | null;
  } | null;
  themePaths?: Array<{ id?: string; slug: string; name?: string } | null> | null;
  accessibility?: string[] | null;
  occurrences: {
    edges: Array<{ node: AvailableOccurrence | null } | null>;
  };
};

export type EventsSearchChild = Pick<ChildNode, 'id' | 'name' | 'birthyear'>;

export type EventsSearchQuery = {
  child?: EventsSearchChild | null;
  events?: {
    count: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    edges: Array<{
      cursor?: string;
      node: AvailableEvent | null;
    } | null>;
  } | null;
};

export type EventsSearchQueryVariables = {
  childId: string;
  first?: number;
  after?: string | null;
  startDate?: string | null;
  languages?: string[];
  themePaths?: string[];
  accessibility?: string[];
  familyOnly?: boolean;
  availableOnly?: boolean;
};
