import {
  ChildByIdQueryFieldsFragment,
  PastEventsFieldsFragment,
  PastEventFieldsFragment,
  ActiveInternalAndTicketSystemEnrolmentsFieldsFragment,
  ActiveInternalEnrolmentFieldsFragment,
  ActiveTicketmasterEnrolmentFieldsFragment,
  ActiveLippupisteEnrolmentFieldsFragment,
  EnrolmentOccurrenceFieldsFragment,
  UpcomingEventsAndEventGroupsFieldsFragment,
  UpcomingEventFieldsFragment,
  UpcomingEventGroupFieldsFragment,
  ActiveTixlyEnrolmentFieldsFragment,
} from '../../api/generatedTypes/graphql';

export type ChildByIdResponse = ChildByIdQueryFieldsFragment;

export type PastEvents = PastEventsFieldsFragment;

export type PastEvent = PastEventFieldsFragment;

export type InternalAndTicketSystemEnrolments =
  ActiveInternalAndTicketSystemEnrolmentsFieldsFragment;

export type InternalEnrolment = ActiveInternalEnrolmentFieldsFragment;

export type TicketmasterEnrolment = ActiveTicketmasterEnrolmentFieldsFragment;

export type LippupisteEnrolment = ActiveLippupisteEnrolmentFieldsFragment;

export type TixlyEnrolment = ActiveTixlyEnrolmentFieldsFragment;

export type InternalOrTicketSystemEnrolment =
  | ActiveInternalEnrolmentFieldsFragment
  | ActiveTicketmasterEnrolmentFieldsFragment
  | ActiveLippupisteEnrolmentFieldsFragment
  | ActiveTixlyEnrolmentFieldsFragment;

export type InternalEnrolmentOccurrence = EnrolmentOccurrenceFieldsFragment;

export type UpcomingEventsAndEventGroups =
  UpcomingEventsAndEventGroupsFieldsFragment;

export type EnrolmentEventGroup = {
  __typename?: 'EventGroupNode';
  id: string;
  name?: string | null;
  publishedAt?: string | null;
};

export type UpcomingEventGroupEvent = {
  __typename?: 'EventNode';
  id: string;
  name?: string | null;
  publishedAt?: string | null;
  canChildEnroll?: boolean | null;
};

export type UpcomingEvent = UpcomingEventFieldsFragment;

export type UpcomingEventGroup = UpcomingEventGroupFieldsFragment & {
  publishedAt?: string | null;
  events?: {
    __typename?: 'EventNodeConnection';
    edges: Array<{
      __typename?: 'EventNodeEdge';
      node?: UpcomingEventGroupEvent | null;
    } | null>;
  } | null;
};

export type UpcomingEventOrEventGroup =
  | UpcomingEvent
  | UpcomingEventGroup;
