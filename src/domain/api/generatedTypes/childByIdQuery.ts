/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite, RelationshipTypeEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: childByIdQuery
// ====================================================

export interface childByIdQuery_child_project {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  year: number;
}

export interface childByIdQuery_child_occurrences_edges_node_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface childByIdQuery_child_occurrences_edges_node_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  /**
   * In minutes
   */
  duration: number | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
}

export interface childByIdQuery_child_occurrences_edges_node_enrolments_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * An unique encoded reference id
   */
  referenceId: string | null;
}

export interface childByIdQuery_child_occurrences_edges_node_enrolments_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_occurrences_edges_node_enrolments_edges_node | null;
}

export interface childByIdQuery_child_occurrences_edges_node_enrolments {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_occurrences_edges_node_enrolments_edges | null)[];
}

export interface childByIdQuery_child_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  venue: childByIdQuery_child_occurrences_edges_node_venue;
  event: childByIdQuery_child_occurrences_edges_node_event;
  enrolments: childByIdQuery_child_occurrences_edges_node_enrolments;
}

export interface childByIdQuery_child_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_occurrences_edges_node | null;
}

export interface childByIdQuery_child_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_occurrences_edges | null)[];
}

export interface childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
}

export interface childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventGroupNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
}

export type childByIdQuery_child_availableEventsAndEventGroups_edges_node = childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventNode | childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventGroupNode;

export interface childByIdQuery_child_availableEventsAndEventGroups_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_availableEventsAndEventGroups_edges_node | null;
}

export interface childByIdQuery_child_availableEventsAndEventGroups {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_availableEventsAndEventGroups_edges | null)[];
}

export interface childByIdQuery_child_pastEvents_edges_node_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
}

export interface childByIdQuery_child_pastEvents_edges_node_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_pastEvents_edges_node_occurrences_edges_node | null;
}

export interface childByIdQuery_child_pastEvents_edges_node_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_pastEvents_edges_node_occurrences_edges | null)[];
}

export interface childByIdQuery_child_pastEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  occurrences: childByIdQuery_child_pastEvents_edges_node_occurrences;
}

export interface childByIdQuery_child_pastEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_pastEvents_edges_node | null;
}

export interface childByIdQuery_child_pastEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_pastEvents_edges | null)[];
}

export interface childByIdQuery_child_relationships_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  type: RelationshipTypeEnum | null;
}

export interface childByIdQuery_child_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_relationships_edges_node | null;
}

export interface childByIdQuery_child_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_relationships_edges | null)[];
}

export interface childByIdQuery_child {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  project: childByIdQuery_child_project;
  occurrences: childByIdQuery_child_occurrences;
  availableEventsAndEventGroups: childByIdQuery_child_availableEventsAndEventGroups | null;
  pastEvents: childByIdQuery_child_pastEvents | null;
  relationships: childByIdQuery_child_relationships;
}

export interface childByIdQuery {
  /**
   * The ID of the object
   */
  child: childByIdQuery_child | null;
}

export interface childByIdQueryVariables {
  id: string;
}
