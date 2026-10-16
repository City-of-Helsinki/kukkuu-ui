import type {
  ChildNode,
  EventNode,
  OccurrenceNode,
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
    | 'canChildEnroll'
  >,
  'image'
> & {
  image?: string | null;
  occurrences: {
    edges: Array<{ node: AvailableOccurrence | null } | null>;
  };
};

export type ChildAvailableOccurrencesQuery = {
  child?:
    | (Pick<ChildNode, 'id' | 'name' | 'birthyear'> & {
        availableEvents?: {
          edges: Array<{ node: AvailableEvent | null } | null>;
        } | null;
      })
    | null;
};

export type ChildAvailableOccurrencesQueryVariables = {
  id: string;
};

export type FlattenedOccurrenceItem = {
  event: AvailableEvent;
  occurrence: AvailableOccurrence;
};
