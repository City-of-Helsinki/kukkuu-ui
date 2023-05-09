/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite, TicketSystem } from "./globalTypes";

// ====================================================
// GraphQL query operation: externalTicketSystemEventQuery
// ====================================================

export interface externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export interface externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem = externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem | externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem | externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem_LippupisteOccurrenceTicketSystem;

export interface externalTicketSystemEventQuery_event_occurrences_edges_node {
  ticketSystem: externalTicketSystemEventQuery_event_occurrences_edges_node_ticketSystem | null;
}

export interface externalTicketSystemEventQuery_event_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: externalTicketSystemEventQuery_event_occurrences_edges_node | null;
}

export interface externalTicketSystemEventQuery_event_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (externalTicketSystemEventQuery_event_occurrences_edges | null)[];
}

export interface externalTicketSystemEventQuery_event_ticketSystem_InternalEventTicketSystem {
  type: TicketSystem;
}

export interface externalTicketSystemEventQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  type: TicketSystem;
  childPassword: string | null;
  url: string;
}

export interface externalTicketSystemEventQuery_event_ticketSystem_LippupisteEventTicketSystem {
  type: TicketSystem;
  childPassword: string | null;
  url: string;
}

export type externalTicketSystemEventQuery_event_ticketSystem = externalTicketSystemEventQuery_event_ticketSystem_InternalEventTicketSystem | externalTicketSystemEventQuery_event_ticketSystem_TicketmasterEventTicketSystem | externalTicketSystemEventQuery_event_ticketSystem_LippupisteEventTicketSystem;

export interface externalTicketSystemEventQuery_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  description: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  occurrences: externalTicketSystemEventQuery_event_occurrences;
  ticketSystem: externalTicketSystemEventQuery_event_ticketSystem | null;
}

export interface externalTicketSystemEventQuery {
  event: externalTicketSystemEventQuery_event | null;
}

export interface externalTicketSystemEventQueryVariables {
  eventId: string;
  childId: string;
}
