import {
  EnrolOccurrenceMutation,
  UnenrolOccurrenceMutation,
} from '../../api/generatedTypes/graphql';

type EnrolOccurrences = NonNullable<
  NonNullable<
    NonNullable<EnrolOccurrenceMutation['enrolOccurrence']>['enrolment']
  >['child']
>['occurrences'];

type UnenrolOccurrences = NonNullable<
  NonNullable<UnenrolOccurrenceMutation['unenrolOccurrence']>['child']
>['occurrences'];

export interface ChildEvents {
  childId: string;
  eventIds: string[];
}

export interface ChildOccurrences {
  childId: string;
  occurrences: EnrolOccurrences | UnenrolOccurrences;
}
