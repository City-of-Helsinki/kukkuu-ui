import { ChildByIdQuery } from '../../api/generatedTypes/graphql';

export type ChildByIdResponse = NonNullable<ChildByIdQuery['child']>;

export type PastEvents = ChildByIdResponse['pastEvents'];

export type PastEvent = NonNullable<
  NonNullable<PastEvents>['edges'][number]
>['node'];

export type InternalAndTicketSystemEnrolments =
  ChildByIdResponse['activeInternalAndTicketSystemEnrolments'];

export type InternalOrTicketSystemEnrolment = NonNullable<
  NonNullable<
    NonNullable<InternalAndTicketSystemEnrolments>['edges'][number]
  >['node']
>;

export type InternalEnrolment = Extract<
  InternalOrTicketSystemEnrolment,
  { __typename: 'EnrolmentNode' }
>;

export type TicketmasterEnrolment = Extract<
  InternalOrTicketSystemEnrolment,
  { __typename: 'TicketmasterEnrolmentNode' }
>;

export type LippupisteEnrolment = Extract<
  InternalOrTicketSystemEnrolment,
  { __typename: 'LippupisteEnrolmentNode' }
>;

export type InternalEnrolmentOccurrence = NonNullable<
  InternalEnrolment['occurrence']
>;

export type UpcomingEventsAndEventGroups =
  ChildByIdResponse['upcomingEventsAndEventGroups'];

export type UpcomingEventOrEventGroup = NonNullable<
  NonNullable<
    NonNullable<UpcomingEventsAndEventGroups>['edges'][number]
  >['node']
>;

export type UpcomingEvent = Extract<
  UpcomingEventOrEventGroup,
  { __typename: 'EventNode' }
>;

export type UpcomingEventGroup = Extract<
  UpcomingEventOrEventGroup,
  { __typename: 'EventGroupNode' }
>;
