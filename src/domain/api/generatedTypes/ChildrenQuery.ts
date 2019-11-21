/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildrenQuery
// ====================================================

export interface ChildrenQuery_children_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
}

export interface ChildrenQuery_children_edges_node {
  __typename: "ChildNode";
  firstName: string;
}

export interface ChildrenQuery_children_edges {
  __typename: "ChildNodeEdge";
  /**
   * The item at the end of the edge
   */
  node: ChildrenQuery_children_edges_node | null;
}

export interface ChildrenQuery_children {
  __typename: "ChildNodeConnection";
  /**
   * Pagination data for this connection.
   */
  pageInfo: ChildrenQuery_children_pageInfo;
  /**
   * Contains the nodes in this connection.
   */
  edges: (ChildrenQuery_children_edges | null)[];
}

export interface ChildrenQuery {
  children: ChildrenQuery_children | null;
}
