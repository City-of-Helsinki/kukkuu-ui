import {
  ChildInput,
  AddChildMutationInput,
  UpdateChildMutationInput,
  ChildByIdQuery,
} from '../../api/generatedTypes/graphql';

export interface Child extends ChildInput {
  homeCity: string;
}

export interface AddChild extends AddChildMutationInput {
  homeCity: string;
}

export interface UpdateChild extends UpdateChildMutationInput {
  homeCity: string;
}

export type ChildByIdResponse = NonNullable<ChildByIdQuery['child']>;

export type UpcomingEventsAndEventGroups =
  ChildByIdResponse['upcomingEventsAndEventGroups'];

export type PastEvents = ChildByIdResponse['pastEvents'];

export type InternalAndTicketSystemEnrolments =
  ChildByIdResponse['activeInternalAndTicketSystemEnrolments'];

export type Children = Child[];
