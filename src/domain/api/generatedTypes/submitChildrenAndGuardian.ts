/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChildInput, GuardianInput, Language, RelationshipTypeEnum } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: submitChildrenAndGuardian
// ====================================================

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships_edges_node {
  type: RelationshipTypeEnum | null;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships_edges_node | null;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships_edges | null)[];
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  relationships: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node_relationships;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges {
  /**
   * The item at the end of the edge
   */
  node: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges_node | null;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children {
  /**
   * Contains the nodes in this connection.
   */
  edges: (submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children_edges | null)[];
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  language: Language | null;
  children: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian_children;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian {
  guardian: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian | null;
}

export interface submitChildrenAndGuardian {
  /**
   * This is the first mutation one needs to execute to start using the service.
   * After that this mutation cannot be used anymore.
   */
  submitChildrenAndGuardian: submitChildrenAndGuardian_submitChildrenAndGuardian | null;
}

export interface submitChildrenAndGuardianVariables {
  children: ChildInput[];
  guardian: GuardianInput;
}
