/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: languageQuery
// ====================================================

export interface languageQuery_languages_edges_node {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
}

export interface languageQuery_languages_edges {
  /**
   * The item at the end of the edge
   */
  node: languageQuery_languages_edges_node | null;
}

export interface languageQuery_languages {
  /**
   * Contains the nodes in this connection.
   */
  edges: (languageQuery_languages_edges | null)[];
}

export interface languageQuery {
  languages: languageQuery_languages | null;
}
