/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL query operation: occurrenceQuery
// ====================================================

export interface occurrenceQuery_occurrence_event_eventGroup {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface occurrenceQuery_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
  image: string;
  imageAltText: string | null;
  description: string | null;
  shortDescription: string | null;
  name: string | null;
  /**
   * In minutes
   */
  duration: number | null;
  participantsPerInvite: EventParticipantsPerInvite;
  eventGroup: occurrenceQuery_occurrence_event_eventGroup | null;
}

export interface occurrenceQuery_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
  accessibilityInfo: string | null;
  arrivalInstructions: string | null;
  additionalInfo: string | null;
  wwwUrl: string | null;
  wcAndFacilities: string | null;
}

export interface occurrenceQuery_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: occurrenceQuery_occurrence_event;
  venue: occurrenceQuery_occurrence_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
}

export interface occurrenceQuery {
  /**
   * The ID of the object
   */
  occurrence: occurrenceQuery_occurrence | null;
}

export interface occurrenceQueryVariables {
  id: string;
  childId?: string | null;
}
