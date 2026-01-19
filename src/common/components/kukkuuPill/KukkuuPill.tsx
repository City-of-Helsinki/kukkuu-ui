import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './kukkuuPill.module.scss';

type Props = {
  name: string | ReactNode;
  iconStart?: ReactNode;
  variant?: 'default' | 'success';
};

export default function KukkuuPill({
  name,
  iconStart,
  variant = 'default',
}: Props) {
  return (
    <div
      data-testid={`kukkuu-pill-${variant}`}
      className={classNames(styles.pill, styles[variant])}
    >
      {iconStart}
      {name}
    </div>
  );
}
