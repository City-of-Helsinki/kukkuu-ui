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
} from '../../api/generatedTypes/graphql';

export type ChildByIdResponse = ChildByIdQueryFieldsFragment;

export type PastEvents = PastEventsFieldsFragment;

export type PastEvent = PastEventFieldsFragment;

export type InternalAndTicketSystemEnrolments =
  ActiveInternalAndTicketSystemEnrolmentsFieldsFragment;

export type InternalEnrolment = ActiveInternalEnrolmentFieldsFragment;

export type TicketmasterEnrolment = ActiveTicketmasterEnrolmentFieldsFragment;

export type LippupisteEnrolment = ActiveLippupisteEnrolmentFieldsFragment;

export type InternalOrTicketSystemEnrolment =
  | ActiveInternalEnrolmentFieldsFragment
  | ActiveTicketmasterEnrolmentFieldsFragment
  | ActiveLippupisteEnrolmentFieldsFragment;

export type InternalEnrolmentOccurrence = EnrolmentOccurrenceFieldsFragment;

export type UpcomingEventsAndEventGroups =
  UpcomingEventsAndEventGroupsFieldsFragment;

export type UpcomingEvent = UpcomingEventFieldsFragment;

export type UpcomingEventGroup = UpcomingEventGroupFieldsFragment;

export type UpcomingEventOrEventGroup =
  | UpcomingEventFieldsFragment
  | UpcomingEventGroupFieldsFragment;
