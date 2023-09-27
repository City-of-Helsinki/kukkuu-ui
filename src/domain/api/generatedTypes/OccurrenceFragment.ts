/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TicketSystem } from './globalTypes';

// ====================================================
// GraphQL fragment: OccurrenceFragment
// ====================================================

export interface OccurrenceFragment_event {
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

export interface OccurrenceFragment_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface OccurrenceFragment_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface OccurrenceFragment_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export interface OccurrenceFragment_ticketSystem_LippupisteOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type OccurrenceFragment_ticketSystem =
  | OccurrenceFragment_ticketSystem_InternalOccurrenceTicketSystem
  | OccurrenceFragment_ticketSystem_TicketmasterOccurrenceTicketSystem
  | OccurrenceFragment_ticketSystem_LippupisteOccurrenceTicketSystem;

export interface OccurrenceFragment {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: OccurrenceFragment_event;
  venue: OccurrenceFragment_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
  ticketSystem: OccurrenceFragment_ticketSystem | null;
}
