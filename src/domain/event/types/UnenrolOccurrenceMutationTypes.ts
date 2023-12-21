import { UnenrolOccurrenceMutation } from '../../api/generatedTypes/graphql';

export type UnenrolOccurrences = NonNullable<
  NonNullable<UnenrolOccurrenceMutation['unenrolOccurrence']>['child']
>['occurrences'];
