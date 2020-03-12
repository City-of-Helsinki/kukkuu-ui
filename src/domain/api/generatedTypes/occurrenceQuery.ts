/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL query operation: occurrenceQuery
// ====================================================

export interface occurrenceQuery_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
  image: string;
  description: string | null;
  shortDescription: string | null;
  name: string | null;
  /**
   * In minutes
   */
  duration: number | null;
  participantsPerInvite: EventParticipantsPerInvite;
}

export interface occurrenceQuery_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  description: string | null;
  address: string | null;
  accessibilityInfo: string | null;
  arrivalInstructions: string | null;
  additionalInfo: string | null;
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
}

export interface occurrenceQuery {
  /**
   * The ID of the object
   */
  occurrence: occurrenceQuery_occurrence | null;
}

export interface occurrenceQueryVariables {
  id: string;
}
