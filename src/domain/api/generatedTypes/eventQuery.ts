/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite, TicketSystem } from "./globalTypes";

// ====================================================
// GraphQL query operation: eventQuery
// ====================================================

export interface eventQuery_event_eventGroup {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface eventQuery_event_occurrences_edges_node_event {
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

export interface eventQuery_event_occurrences_edges_node_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface eventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface eventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export interface eventQuery_event_occurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type eventQuery_event_occurrences_edges_node_ticketSystem = eventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem | eventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem | eventQuery_event_occurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem;

export interface eventQuery_event_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: eventQuery_event_occurrences_edges_node_event;
  venue: eventQuery_event_occurrences_edges_node_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
  ticketSystem: eventQuery_event_occurrences_edges_node_ticketSystem | null;
}

export interface eventQuery_event_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: eventQuery_event_occurrences_edges_node | null;
}

export interface eventQuery_event_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (eventQuery_event_occurrences_edges | null)[];
}

export interface eventQuery_event_allOccurrences_edges_node_event {
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

export interface eventQuery_event_allOccurrences_edges_node_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface eventQuery_event_allOccurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface eventQuery_event_allOccurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export interface eventQuery_event_allOccurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type eventQuery_event_allOccurrences_edges_node_ticketSystem = eventQuery_event_allOccurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem | eventQuery_event_allOccurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem | eventQuery_event_allOccurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem;

export interface eventQuery_event_allOccurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: eventQuery_event_allOccurrences_edges_node_event;
  venue: eventQuery_event_allOccurrences_edges_node_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
  ticketSystem: eventQuery_event_allOccurrences_edges_node_ticketSystem | null;
}

export interface eventQuery_event_allOccurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: eventQuery_event_allOccurrences_edges_node | null;
}

export interface eventQuery_event_allOccurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (eventQuery_event_allOccurrences_edges | null)[];
}

export interface eventQuery_event_ticketSystem_InternalEventTicketSystem {
  type: TicketSystem;
}

export interface eventQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  type: TicketSystem;
  childPassword: string | null;
  url: string;
}

export interface eventQuery_event_ticketSystem_LippupisteEventTicketSystem {
  type: TicketSystem;
  childPassword: string | null;
  url: string;
}

export type eventQuery_event_ticketSystem = eventQuery_event_ticketSystem_InternalEventTicketSystem | eventQuery_event_ticketSystem_TicketmasterEventTicketSystem | eventQuery_event_ticketSystem_LippupisteEventTicketSystem;

export interface eventQuery_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  description: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  /**
   * In minutes
   */
  duration: number | null;
  capacityPerOccurrence: number | null;
  canChildEnroll: boolean | null;
  eventGroup: eventQuery_event_eventGroup | null;
  occurrences: eventQuery_event_occurrences;
  allOccurrences: eventQuery_event_allOccurrences;
  ticketSystem: eventQuery_event_ticketSystem | null;
}

export interface eventQuery {
  event: eventQuery_event | null;
}

export interface eventQueryVariables {
  id: string;
  date?: any | null;
  time?: any | null;
  childId: string;
}
