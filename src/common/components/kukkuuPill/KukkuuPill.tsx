import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './kukkuuPill.module.scss';

type Props = {
  name: string | ReactNode;
  iconLeft?: ReactNode;
  variant?: 'default' | 'success';
};

export default function KukkuuPill({
  name,
  iconLeft,
  variant = 'default',
}: Props) {
  return (
    <div className={classNames(styles.pill, styles[variant])}>
      {iconLeft}
      {name}
    </div>
  );
}
