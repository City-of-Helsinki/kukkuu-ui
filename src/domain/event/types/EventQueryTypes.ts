import { EventQuery } from '../../api/generatedTypes/graphql';

export type Occurrences = NonNullable<
  NonNullable<EventQuery['event']>['occurrences']
>;

export type OccurrenceNode = NonNullable<
  NonNullable<Occurrences['edges'][number]>['node']
>;
