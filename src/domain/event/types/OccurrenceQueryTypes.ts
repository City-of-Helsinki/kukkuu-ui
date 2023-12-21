import { OccurrenceQuery } from '../../api/generatedTypes/graphql';

export type OccurrenceVenue = NonNullable<
  NonNullable<OccurrenceQuery['occurrence']>['venue']
>;

export type OccurrenceEvent = NonNullable<
  OccurrenceQuery['occurrence']
>['event'];
