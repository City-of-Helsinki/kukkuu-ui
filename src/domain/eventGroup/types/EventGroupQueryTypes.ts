import { EventGroupQuery } from '../../api/generatedTypes/graphql';

export type EventNode = NonNullable<
  NonNullable<EventGroupQuery['eventGroup']>['events']['edges'][number]
>['node'];
