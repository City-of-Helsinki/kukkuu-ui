type Edge<Node> = {
  node?: Node | null;
};
type TRelayList<Node> = {
  edges?: (Edge<Node> | null)[] | null;
} | null;

class RelayList<Node> {
  data?: TRelayList<Node>;

  constructor(data?: TRelayList<Node>) {
    this.data = data;
  }

  get items(): Exclude<Node, null>[] {
    if (!this.data?.edges) {
      return [];
    }

    return this.data?.edges
      .map((edge) => edge?.node)
      .filter((node): node is Exclude<Node, null> => Boolean(node));
  }
}

function RelayListFactory<Node>(): (
  data?: TRelayList<Node>
) => RelayList<Node> {
  return (data?: TRelayList<Node>) => new RelayList<Node>(data);
}

export default RelayListFactory;
