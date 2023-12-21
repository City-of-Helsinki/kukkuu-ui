export const nlToParagraph = (text: string) => {
  return (text || '').split(/\r?\n/g).map((item, i) => <p key={i}>{item}</p>);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const getNodeText = (node: any): string => {
  if (['string', 'number'].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children);
  return node;
};
