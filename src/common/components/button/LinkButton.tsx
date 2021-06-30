import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import LinkButtonBase, { LinkButtonBaseProps } from './LinkButtonBase';

type Props = LinkProps & LinkButtonBaseProps;

const LinkButton = ({ children, ...delegated }: Props) => {
  return (
    <LinkButtonBase as={Link} {...delegated}>
      {children}
    </LinkButtonBase>
  );
};

export default LinkButton;
