/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  Language,
  RelationshipTypeEnum,
  EventParticipantsPerInvite,
} from './globalTypes';

// ====================================================
// GraphQL query operation: profileQuery
// ====================================================

export interface profileQuery_myProfile_children_edges_node_project {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  year: number;
}

export interface profileQuery_myProfile_children_edges_node_relationships_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  type: RelationshipTypeEnum | null;
}

export interface profileQuery_myProfile_children_edges_node_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_children_edges_node_relationships_edges_node | null;
}

export interface profileQuery_myProfile_children_edges_node_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_children_edges_node_relationships_edges | null)[];
}

export interface profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node_EventGroupNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
}

export interface profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node_EventNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  /**
   * In minutes
   */
  duration: number | null;
  participantsPerInvite: EventParticipantsPerInvite;
}

export type profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node =

    | profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node_EventGroupNode
    | profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node_EventNode;

export interface profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges_node | null;
}

export interface profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups_edges | null)[];
}

export interface profileQuery_myProfile_children_edges_node_occurrences_edges_node_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
}

export interface profileQuery_myProfile_children_edges_node_occurrences_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  event: profileQuery_myProfile_children_edges_node_occurrences_edges_node_event;
}

export interface profileQuery_myProfile_children_edges_node_occurrences_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_children_edges_node_occurrences_edges_node | null;
}

export interface profileQuery_myProfile_children_edges_node_occurrences {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_children_edges_node_occurrences_edges | null)[];
}

export interface profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
}

export interface profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence_event {
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

export interface profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  venue: profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence_venue;
  event: profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence_event;
}

export interface profileQuery_myProfile_children_edges_node_enrolments_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  occurrence: profileQuery_myProfile_children_edges_node_enrolments_edges_node_occurrence;
}

export interface profileQuery_myProfile_children_edges_node_enrolments_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_children_edges_node_enrolments_edges_node | null;
}

export interface profileQuery_myProfile_children_edges_node_enrolments {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_children_edges_node_enrolments_edges | null)[];
}

export interface profileQuery_myProfile_children_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  project: profileQuery_myProfile_children_edges_node_project;
  relationships: profileQuery_myProfile_children_edges_node_relationships;
  /**
   * All upcoming events and event groups for the child's project.
   */
  upcomingEventsAndEventGroups: profileQuery_myProfile_children_edges_node_upcomingEventsAndEventGroups | null;
  occurrences: profileQuery_myProfile_children_edges_node_occurrences;
  enrolments: profileQuery_myProfile_children_edges_node_enrolments;
}

export interface profileQuery_myProfile_children_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_children_edges_node | null;
}

export interface profileQuery_myProfile_children {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_children_edges | null)[];
}

export interface profileQuery_myProfile_languagesSpokenAtHome_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface profileQuery_myProfile_languagesSpokenAtHome_edges {
  /**
   * The item at the end of the edge
   */
  node: profileQuery_myProfile_languagesSpokenAtHome_edges_node | null;
}

export interface profileQuery_myProfile_languagesSpokenAtHome {
  /**
   * Contains the nodes in this connection.
   */
  edges: (profileQuery_myProfile_languagesSpokenAtHome_edges | null)[];
}

export interface profileQuery_myProfile {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  /**
   * If left blank, will be populated with the user's email.
   */
  email: string;
  phoneNumber: string;
  language: Language;
  children: profileQuery_myProfile_children;
  languagesSpokenAtHome: profileQuery_myProfile_languagesSpokenAtHome;
}

export interface profileQuery {
  myProfile: profileQuery_myProfile | null;
}
