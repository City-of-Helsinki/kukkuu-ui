/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  EventParticipantsPerInvite,
  RelationshipTypeEnum,
} from './globalTypes';

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

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence_event {
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

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  venue: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence_venue;
  event: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence_event;
}

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode {
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * An unique encoded reference id
   */
  referenceId: string | null;
  occurrence: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence;
  __typename: 'EnrolmentNode';
}

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_TicketmasterEnrolmentNode_event {
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

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_TicketmasterEnrolmentNode {
  /**
   * The ID of the object.
   */
  id: string;
  event: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_TicketmasterEnrolmentNode_event;
  __typename: 'TicketmasterEnrolmentNode';
}

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_LippupisteEnrolmentNode_event {
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

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_LippupisteEnrolmentNode {
  /**
   * The ID of the object.
   */
  id: string;
  event: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_LippupisteEnrolmentNode_event;
  __typename: 'LippupisteEnrolmentNode';
}

export type childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node =

    | childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode
    | childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_TicketmasterEnrolmentNode
    | childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_LippupisteEnrolmentNode;

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node | null;
}

export interface childByIdQuery_child_activeInternalAndTicketSystemEnrolments {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges | null)[];
}

export interface childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  canChildEnroll: boolean | null;
  __typename: 'EventNode';
}

export interface childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventGroupNode {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  canChildEnroll: boolean | null;
  __typename: 'EventGroupNode';
}

export type childByIdQuery_child_upcomingEventsAndEventGroups_edges_node =
  | childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventNode
  | childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventGroupNode;

export interface childByIdQuery_child_upcomingEventsAndEventGroups_edges {
  /**
   * The item at the end of the edge
   */
  node: childByIdQuery_child_upcomingEventsAndEventGroups_edges_node | null;
}

export interface childByIdQuery_child_upcomingEventsAndEventGroups {
  /**
   * Contains the nodes in this connection.
   */
  edges: (childByIdQuery_child_upcomingEventsAndEventGroups_edges | null)[];
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
  /**
   * All upcoming and ongoing (with leeway) internal and ticket system enrolments sorted by time.
   */
  activeInternalAndTicketSystemEnrolments: childByIdQuery_child_activeInternalAndTicketSystemEnrolments | null;
  /**
   * All upcoming events and event groups for the child's project.
   */
  upcomingEventsAndEventGroups: childByIdQuery_child_upcomingEventsAndEventGroups | null;
  pastEvents: childByIdQuery_child_pastEvents | null;
  relationships: childByIdQuery_child_relationships;
}

export interface childByIdQuery {
  child: childByIdQuery_child | null;
}

export interface childByIdQueryVariables {
  id: string;
}
