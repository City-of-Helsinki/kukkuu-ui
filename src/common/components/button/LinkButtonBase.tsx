import * as React from 'react';
import classNames from 'classnames';
import { ButtonPresetTheme, ButtonProps, IconLinkExternal } from 'hds-react';
import { useTranslation } from 'react-i18next';
import 'hds-core/lib/components/button/button.css';

import { getNodeText } from '../../commonUtils';
import styles from './buttonOverrides.module.scss';

export type LinkButtonBaseProps = {
  variant?: ButtonProps['variant'] | 'primary' | 'secondary' | 'supplementary';
  theme?: ButtonPresetTheme | 'black' | 'bus' | 'coat';
  fullWidth?: boolean;
  iconStart?: React.ReactNode;
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
  theme,
  fullWidth = false,
  iconStart,
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
        variant && `hds-button--${variant}`,
        theme && theme !== 'bus' && `hds-button--theme-${theme}`,
        fullWidth && 'hds-button--fullwidth'
      ),
    },
    <>
      {iconStart}
      <span className="hds-button__label">{children}</span>
      {externalLinkIcon}
    </>
  );
};

export default LinkButtonBase;
