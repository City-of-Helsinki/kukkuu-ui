import React, { ReactNode, HTMLAttributes } from 'react';

import styles from './text.module.scss';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body'
  | 'body-l'
  | 'body-xl';

type Props = {
  as?: string | React.ComponentType<HTMLAttributes<HTMLElement>>;
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  role?: string;
};

function getElement(variant: TextVariant) {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'body':
    case 'body-l':
    default:
      return 'p';
  }
}

function Text({ as, variant = 'body', children, className, ...rest }: Props) {
  return React.createElement(
    as || getElement(variant),
    {
      className: [styles.text, styles[variant], className].join(' '),
      ...rest,
    },
    children
  );
}

export default Text;
