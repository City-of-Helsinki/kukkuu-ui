/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: eventGroupQuery
// ====================================================

export interface eventGroupQuery_eventGroup_events_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
}

export interface eventGroupQuery_eventGroup_events_edges {
  /**
   * The item at the end of the edge
   */
  node: eventGroupQuery_eventGroup_events_edges_node | null;
}

export interface eventGroupQuery_eventGroup_events {
  /**
   * Contains the nodes in this connection.
   */
  edges: (eventGroupQuery_eventGroup_events_edges | null)[];
}

export interface eventGroupQuery_eventGroup {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  description: string | null;
  events: eventGroupQuery_eventGroup_events;
}

export interface eventGroupQuery {
  eventGroup: eventGroupQuery_eventGroup | null;
}

export interface eventGroupQueryVariables {
  id: string;
  childId: string;
}
