import {
  EnrolOccurrencesFieldsFragment,
  UnenrolOccurrencesFieldsFragment,
} from '../../api/generatedTypes/graphql';

export interface ChildEvents {
  childId: string;
  eventIds: string[];
}

export interface ChildOccurrences {
  childId: string;
  occurrences:
    | EnrolOccurrencesFieldsFragment
    | UnenrolOccurrencesFieldsFragment;
}
