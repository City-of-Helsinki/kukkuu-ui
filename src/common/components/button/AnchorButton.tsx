import * as React from 'react';

import LinkButtonBase, { LinkButtonBaseProps } from './LinkButtonBase';

const AnchorButton = ({
  children,
  ...delegated
}: React.HTMLProps<HTMLAnchorElement> & LinkButtonBaseProps) => {
  return <LinkButtonBase {...delegated}>{children}</LinkButtonBase>;
};

export default AnchorButton;
