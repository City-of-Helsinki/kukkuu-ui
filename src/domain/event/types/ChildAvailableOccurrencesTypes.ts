import type {
  ChildNode,
  EventNode,
  EventParticipantsPerInvite,
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
  participantsPerInvite?: EventParticipantsPerInvite | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
    hasAnyFreePasswords?: boolean | null;
  } | null;
  // Dynamic theme paths from upcoming KK-1578 backend integration
  themePaths?: Array<{ id?: string; slug: string; name?: string } | null> | null;
  // Optional accessibility attributes for upcoming accessibility endpoint
  accessibility?: string[] | null;
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
        // TODO: Populate from GraphQL once child predefined theme path endpoint (ChildNode.themePath) is implemented,
        // and remove '!src/domain/event/queries/childAvailableEventsQuery.ts' exclude rule from codegen.ts
        themePath?: { id?: string; slug: string; name: string } | null;
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
