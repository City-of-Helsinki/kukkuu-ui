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
  '__typename' | 'id' | 'time' | 'remainingCapacity'
> & {
  languages?: Array<{ alpha3Code: string; name?: string | null } | null> | null;
  accessibilities?: Array<{
    id?: string | null;
    slug: string;
    name?: string | null;
    sortOrder?: number | null;
  } | null> | null;
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
  occurrences: {
    edges: Array<{ node: AvailableOccurrence | null } | null>;
  };
};

export type EventsSearchChild = Pick<ChildNode, 'id' | 'name' | 'birthyear'> & {
  themePath?: {
    id: string;
    slug: string;
    name: string;
  } | null;
};

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
  accessibilities?: string[];
  familyOnly?: boolean;
  hasFreeSpots?: boolean;
};
