import { EnrolOccurrenceMutation } from '../../api/generatedTypes/graphql';

export type EnrolOccurrences = NonNullable<
  NonNullable<
    NonNullable<EnrolOccurrenceMutation['enrolOccurrence']>['enrolment']
  >['child']
>['occurrences'];
