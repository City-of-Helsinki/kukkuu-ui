/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite, TicketSystem } from "./globalTypes";

// ====================================================
// GraphQL query operation: ticketmasterEventQuery
// ====================================================

export interface ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem {
  type: TicketSystem;
}

export interface ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem {
  type: TicketSystem;
  url: string;
}

export type ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem = ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem_InternalOccurrenceTicketSystem | ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem_TicketmasterOccurrenceTicketSystem;

export interface ticketmasterEventQuery_event_occurrences_edges_node {
  ticketSystem: ticketmasterEventQuery_event_occurrences_edges_node_ticketSystem | null;
}

export interface ticketmasterEventQuery_event_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: ticketmasterEventQuery_event_occurrences_edges_node | null;
}

export interface ticketmasterEventQuery_event_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (ticketmasterEventQuery_event_occurrences_edges | null)[];
}

export interface ticketmasterEventQuery_event_ticketSystem_InternalEventTicketSystem {
  type: TicketSystem;
}

export interface ticketmasterEventQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  type: TicketSystem;
  childPassword: string | null;
  url: string;
}

export type ticketmasterEventQuery_event_ticketSystem = ticketmasterEventQuery_event_ticketSystem_InternalEventTicketSystem | ticketmasterEventQuery_event_ticketSystem_TicketmasterEventTicketSystem;

export interface ticketmasterEventQuery_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  description: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  occurrences: ticketmasterEventQuery_event_occurrences;
  ticketSystem: ticketmasterEventQuery_event_ticketSystem | null;
}

export interface ticketmasterEventQuery {
  event: ticketmasterEventQuery_event | null;
}

export interface ticketmasterEventQueryVariables {
  eventId: string;
  childId: string;
}
