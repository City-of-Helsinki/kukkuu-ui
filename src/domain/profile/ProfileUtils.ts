import {
  profileQuery as ProfileQueryType,
  profileQuery_guardians_edges_node_children as ProfileChildrenType,
  profileQuery_guardians_edges_node_children_edges_node as ChildType,
} from '../api/generatedTypes/profileQuery';

export const normalizeProfileData = (data: ProfileQueryType) => {
  if (
    data &&
    data.guardians &&
    data.guardians.edges[0] &&
    data.guardians.edges[0].node
  ) {
    return Object.assign(data.guardians.edges[0].node, {
      children: normalizeChildren(data.guardians.edges[0].node.children),
    });
  }

  return null;
};

export const normalizeChildren = (data: ProfileChildrenType) => {
  const nodes = data.edges.map(edge => (edge ? edge.node : edge));
  return nodes.filter((node): node is ChildType => Boolean(node));
};
