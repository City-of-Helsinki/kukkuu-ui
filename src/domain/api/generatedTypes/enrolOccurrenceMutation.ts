/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EnrolOccurrenceMutationInput, EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: enrolOccurrenceMutation
// ====================================================

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  event: enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence_event;
  venue: enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence_venue;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node_event {
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

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node_venue {
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

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  event: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node_event;
  venue: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node_venue;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges_node | null;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges | null)[];
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents_edges_node | null;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents_edges | null)[];
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents_edges_node | null;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents_edges | null)[];
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment_child {
  /**
   * The ID of the object.
   */
  id: string;
  occurrences: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences;
  pastEvents: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_pastEvents | null;
  availableEvents: enrolOccurrenceMutation_enrolOccurrence_enrolment_child_availableEvents | null;
}

export interface enrolOccurrenceMutation_enrolOccurrence_enrolment {
  /**
   * The ID of the object.
   */
  id: string;
  occurrence: enrolOccurrenceMutation_enrolOccurrence_enrolment_occurrence;
  child: enrolOccurrenceMutation_enrolOccurrence_enrolment_child | null;
}

export interface enrolOccurrenceMutation_enrolOccurrence {
  clientMutationId: string | null;
  enrolment: enrolOccurrenceMutation_enrolOccurrence_enrolment | null;
}

export interface enrolOccurrenceMutation {
  enrolOccurrence: enrolOccurrenceMutation_enrolOccurrence | null;
}

export interface enrolOccurrenceMutationVariables {
  input: EnrolOccurrenceMutationInput;
}
