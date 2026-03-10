import * as React from 'react';
import classNames from 'classnames';
import { ButtonProps, IconLinkExternal } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { getNodeText } from '../../commonUtils';
import styles from './buttonOverrides.module.scss';

const variantClassNameMap: Record<string, string[]> = {
  primary: ['hds-button--primary', styles.primary],
  secondary: ['hds-button--secondary', styles.secondary],
  supplementary: ['hds-button--supplementary', styles.supplementary],
  disabled: ['hds-button--disabled', styles.disabled],
  success: ['hds-button--success'],
  danger: ['hds-button--danger'],
};

export type LinkButtonBaseProps = {
  variant?: ButtonProps['variant'] | 'primary' | 'secondary' | 'supplementary';
  openInNewTab?: boolean;
};

type Props = LinkButtonBaseProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | React.ComponentType<any>;
  children?: React.ReactNode;
  className?: string;
};

const LinkButtonBase = ({
  as = 'a',
  openInNewTab = false,
  children,
  className,
  ...delegated
}: Props) => {
  const { t } = useTranslation();
  const variant = delegated.variant;
  const externalLinkIcon = openInNewTab ? (
    <div className={classNames(styles.externalLinkIcon)} aria-hidden="true">
      <IconLinkExternal />
    </div>
  ) : null;
  return React.createElement(
    as,
    {
      ...(openInNewTab && {
        target: '_blank',
        'aria-label':
          getNodeText(children) + '. ' + t('common.openInNewTabAriaLabel'),
      }),
      ...delegated,
      className: classNames(
        className,
        'hds-button',
        styles.button,
        variant ? variantClassNameMap[variant] : variant
      ),
    },
    <>
      <span className="hds-button__label">{children}</span>
      {externalLinkIcon}
    </>
  );
};

export default LinkButtonBase;
