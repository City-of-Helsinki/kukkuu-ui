/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildrenQuery
// ====================================================

export interface ChildrenQuery_children_edges_node_guardians_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface ChildrenQuery_children_edges_node_guardians_edges {
  /**
   * The item at the end of the edge
   */
  node: ChildrenQuery_children_edges_node_guardians_edges_node | null;
}

export interface ChildrenQuery_children_edges_node_guardians {
  /**
   * Contains the nodes in this connection.
   */
  edges: (ChildrenQuery_children_edges_node_guardians_edges | null)[];
}

export interface ChildrenQuery_children_edges_node_relationships_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface ChildrenQuery_children_edges_node_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: ChildrenQuery_children_edges_node_relationships_edges_node | null;
}

export interface ChildrenQuery_children_edges_node_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (ChildrenQuery_children_edges_node_relationships_edges | null)[];
}

export interface ChildrenQuery_children_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  createdAt: any;
  updatedAt: any;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  guardians: ChildrenQuery_children_edges_node_guardians;
  relationships: ChildrenQuery_children_edges_node_relationships;
}

export interface ChildrenQuery_children_edges {
  /**
   * The item at the end of the edge
   */
  node: ChildrenQuery_children_edges_node | null;
}

export interface ChildrenQuery_children {
  /**
   * Contains the nodes in this connection.
   */
  edges: (ChildrenQuery_children_edges | null)[];
}

export interface ChildrenQuery {
  children: ChildrenQuery_children | null;
}
