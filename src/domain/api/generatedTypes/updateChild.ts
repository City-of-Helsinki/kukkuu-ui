/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateChildMutationInput, RelationshipTypeEnum } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateChild
// ====================================================

export interface updateChild_updateChild_child_relationships_edges_node {
  type: RelationshipTypeEnum | null;
}

export interface updateChild_updateChild_child_relationships_edges {
  /**
   * The item at the end of the edge
   */
  node: updateChild_updateChild_child_relationships_edges_node | null;
}

export interface updateChild_updateChild_child_relationships {
  /**
   * Contains the nodes in this connection.
   */
  edges: (updateChild_updateChild_child_relationships_edges | null)[];
}

export interface updateChild_updateChild_child {
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  relationships: updateChild_updateChild_child_relationships;
}

export interface updateChild_updateChild {
  child: updateChild_updateChild_child | null;
}

export interface updateChild {
  updateChild: updateChild_updateChild | null;
}

export interface updateChildVariables {
  input: UpdateChildMutationInput;
}
