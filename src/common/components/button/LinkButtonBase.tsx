import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from 'hds-react';

import styles from './buttonOverrides.module.scss';

const variantClassNameMap = {
  primary: ['hds-button--primary', styles.primary],
  secondary: ['hds-button--secondary', styles.secondary],
  supplementary: ['hds-button--supplementary', styles.supplementary],
  disabled: ['hds-button--disabled', styles.disabled],
  success: ['hds-button--success'],
  danger: ['hds-button--danger'],
};

export type LinkButtonBaseProps = {
  variant?: ButtonProps['variant'];
};

type Props = LinkButtonBaseProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | React.ComponentType<any>;
  children?: React.ReactNode;
  className?: string;
};

const LinkButtonBase = ({
  as = 'a',
  children,
  className,
  ...delegated
}: Props) => {
  const variant = delegated.variant;
  return React.createElement(
    as,
    {
      ...delegated,
      className: classNames(
        className,
        'hds-button',
        styles.button,
        variant ? variantClassNameMap[variant] : variant
      ),
    },
    <span className="hds-button__label">{children}</span>
  );
};

export default LinkButtonBase;
