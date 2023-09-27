/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  UnenrolOccurrenceMutationInput,
  EventParticipantsPerInvite,
} from './globalTypes';

// ====================================================
// GraphQL mutation operation: unenrolOccurrenceMutation
// ====================================================

export interface unenrolOccurrenceMutation_unenrolOccurrence_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  event: unenrolOccurrenceMutation_unenrolOccurrence_occurrence_event;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents_edges_node | null;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents_edges | null)[];
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node_event {
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
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node_venue {
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

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  event: unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node_event;
  venue: unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node_venue;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges_node | null;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges | null)[];
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents_edges_node | null;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents_edges | null)[];
}

export interface unenrolOccurrenceMutation_unenrolOccurrence_child {
  /**
   * The ID of the object.
   */
  id: string;
  availableEvents: unenrolOccurrenceMutation_unenrolOccurrence_child_availableEvents | null;
  occurrences: unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences;
  pastEvents: unenrolOccurrenceMutation_unenrolOccurrence_child_pastEvents | null;
}

export interface unenrolOccurrenceMutation_unenrolOccurrence {
  clientMutationId: string | null;
  occurrence: unenrolOccurrenceMutation_unenrolOccurrence_occurrence | null;
  child: unenrolOccurrenceMutation_unenrolOccurrence_child | null;
}

export interface unenrolOccurrenceMutation {
  unenrolOccurrence: unenrolOccurrenceMutation_unenrolOccurrence | null;
}

export interface unenrolOccurrenceMutationVariables {
  input: UnenrolOccurrenceMutationInput;
}
