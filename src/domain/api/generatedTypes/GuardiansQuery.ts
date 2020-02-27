/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Language } from "./globalTypes";

// ====================================================
// GraphQL query operation: GuardiansQuery
// ====================================================

export interface GuardiansQuery_guardians_edges_node_children_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface GuardiansQuery_guardians_edges_node_children_edges {
  /**
   * The item at the end of the edge
   */
  node: GuardiansQuery_guardians_edges_node_children_edges_node | null;
}

export interface GuardiansQuery_guardians_edges_node_children {
  /**
   * Contains the nodes in this connection.
   */
  edges: (GuardiansQuery_guardians_edges_node_children_edges | null)[];
}

export interface GuardiansQuery_guardians_edges_node_relationships_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
}

export interface GuardiansQuery_guardians_edges_node_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: GuardiansQuery_guardians_edges_node_relationships_edges_node | null;
}

export interface GuardiansQuery_guardians_edges_node_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (GuardiansQuery_guardians_edges_node_relationships_edges | null)[];
}

export interface GuardiansQuery_guardians_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  createdAt: any;
  updatedAt: any;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  language: Language | null;
  children: GuardiansQuery_guardians_edges_node_children;
  relationships: GuardiansQuery_guardians_edges_node_relationships;
  email: string | null;
}

export interface GuardiansQuery_guardians_edges {
  /**
   * The item at the end of the edge
   */
  node: GuardiansQuery_guardians_edges_node | null;
}

export interface GuardiansQuery_guardians {
  /**
   * Contains the nodes in this connection.
   */
  edges: (GuardiansQuery_guardians_edges | null)[];
}

export interface GuardiansQuery {
  guardians: GuardiansQuery_guardians | null;
}
