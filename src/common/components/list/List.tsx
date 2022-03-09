import React from 'react';
import classNames from 'classnames';

import styles from './list.module.scss';

type Props = {
  items: (JSX.Element | null | false)[];
  variant?:
    | 'spacing-4-xs'
    | 'spacing-3-xs'
    | 'spacing-2-xs'
    | 'spacing-xs'
    | 'spacing-s'
    | 'spacing-m'
    | 'spacing-l'
    | 'spacing-xl'
    | 'spacing-2-xl'
    | 'spacing-3-xl'
    | 'spacing-4-xl'
    | 'spacing-5-xl'
    | 'spacing-layout-2-xs'
    | 'spacing-layout-xs'
    | 'spacing-layout-s'
    | 'spacing-layout-m'
    | 'spacing-layout-l'
    | 'spacing-layout-xl'
    | 'spacing-layout-2-xl';
};

export default function List({ items, variant = 'spacing-m' }: Props) {
  return (
    <ul className={classNames(styles.list, styles[variant])}>
      {items.map((item) =>
        item ? (
          <li key={item.key} className={styles.item}>
            {item}
          </li>
        ) : null
      )}
    </ul>
  );
}
