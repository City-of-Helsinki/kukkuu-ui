/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL query operation: eventQuery
// ====================================================

export interface eventQuery_event_occurrences_edges_node_venue {
  name: string | null;
  description: string | null;
  address: string | null;
}

export interface eventQuery_event_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any | null;
  remainingCapacity: number | null;
  venue: eventQuery_event_occurrences_edges_node_venue;
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

export interface eventQuery_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  description: string | null;
  shortDescription: string | null;
  image: string;
  participantsPerInvite: EventParticipantsPerInvite;
  /**
   * In minutes
   */
  duration: number | null;
  capacityPerOccurrence: number;
  occurrences: eventQuery_event_occurrences;
}

export interface eventQuery {
  /**
   * The ID of the object
   */
  event: eventQuery_event | null;
}

export interface eventQueryVariables {
  id: string;
}
