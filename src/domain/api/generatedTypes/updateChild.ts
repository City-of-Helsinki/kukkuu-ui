/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateChildMutationInput, RelationshipTypeEnum } from './globalTypes';

// ====================================================
// GraphQL mutation operation: updateChild
// ====================================================

export interface updateChild_updateChild_child_project {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  year: number;
}

export interface updateChild_updateChild_child_relationships_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
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
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
  project: updateChild_updateChild_child_project;
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
