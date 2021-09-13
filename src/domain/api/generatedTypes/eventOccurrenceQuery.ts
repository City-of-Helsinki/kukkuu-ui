/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TicketSystem } from "./globalTypes";

// ====================================================
// GraphQL query operation: eventOccurrenceQuery
// ====================================================

export interface eventOccurrenceQuery_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  /**
   * In minutes
   */
  duration: number | null;
}

export interface eventOccurrenceQuery_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface eventOccurrenceQuery_occurrence_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface eventOccurrenceQuery_occurrence_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type eventOccurrenceQuery_occurrence_ticketSystem = eventOccurrenceQuery_occurrence_ticketSystem_InternalOccurrenceTicketSystem | eventOccurrenceQuery_occurrence_ticketSystem_TicketmasterOccurrenceTicketSystem;

export interface eventOccurrenceQuery_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: eventOccurrenceQuery_occurrence_event;
  venue: eventOccurrenceQuery_occurrence_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
  ticketSystem: eventOccurrenceQuery_occurrence_ticketSystem | null;
}

export interface eventOccurrenceQuery {
  /**
   * The ID of the object
   */
  occurrence: eventOccurrenceQuery_occurrence | null;
}

export interface eventOccurrenceQueryVariables {
  id: string;
  childId: string;
}
