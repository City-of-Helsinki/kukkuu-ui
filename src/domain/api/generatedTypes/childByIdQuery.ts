/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RelationshipTypeEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: childByIdQuery
// ====================================================

export interface childByIdQuery_child_availableEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
}

export interface childByIdQuery_child_availableEvents_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_availableEvents_edges_node | null;
}

export interface childByIdQuery_child_availableEvents {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_availableEvents_edges | null)[];
}

export interface childByIdQuery_child_enrolments_edges_node_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
}

export interface childByIdQuery_child_enrolments_edges_node_occurrence_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  /**
   * In minutes
   */
  duration: number | null;
}

export interface childByIdQuery_child_enrolments_edges_node_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  venue: childByIdQuery_child_enrolments_edges_node_occurrence_venue;
  event: childByIdQuery_child_enrolments_edges_node_occurrence_event;
}

export interface childByIdQuery_child_enrolments_edges_node {
  occurrence: childByIdQuery_child_enrolments_edges_node_occurrence;
}

export interface childByIdQuery_child_enrolments_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_enrolments_edges_node | null;
}

export interface childByIdQuery_child_enrolments {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_enrolments_edges | null)[];
}

export interface childByIdQuery_child_pastEvents_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
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
  availableEvents: childByIdQuery_child_availableEvents | null;
  enrolments: childByIdQuery_child_enrolments;
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
