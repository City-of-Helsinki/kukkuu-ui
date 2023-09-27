/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildEventInvitationLabelQuery
// ====================================================

export interface ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node_EventGroupNode {
  /**
   * The ID of the object.
   */
  id: string;
  canChildEnroll: boolean | null;
}

export interface ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node_EventNode {
  /**
   * The ID of the object.
   */
  id: string;
  canChildEnroll: boolean | null;
}

export type ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node =

    | ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node_EventGroupNode
    | ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node_EventNode;

export interface ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges {
  /**
   * The item at the end of the edge
   */
  node: ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges_node | null;
}

export interface ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups {
  /**
   * Contains the nodes in this connection.
   */
  edges: (ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups_edges | null)[];
}

export interface ChildEventInvitationLabelQuery_child {
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * All upcoming events and event groups for the child's project.
   */
  upcomingEventsAndEventGroups: ChildEventInvitationLabelQuery_child_upcomingEventsAndEventGroups | null;
}

export interface ChildEventInvitationLabelQuery {
  child: ChildEventInvitationLabelQuery_child | null;
}

export interface ChildEventInvitationLabelQueryVariables {
  childId: string;
}
