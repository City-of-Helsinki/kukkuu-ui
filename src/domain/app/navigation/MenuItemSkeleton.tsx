import React from 'react';
import classNames from 'classnames';

import { SkeletonLine } from '../../../common/components/skeleton/CmsSkeleton';
import styles from './userNavigation.module.scss';

export type MenuItemSkeletonProps = Readonly<{
  className?: string;
  itemCount?: number;
}>;

interface SkeletonItem {
  id: string;
  width: string;
}

const DEFAULT_SKELETON_ITEMS: readonly SkeletonItem[] = [
  { id: 'mobile-nav-skeleton-1', width: '65%' },
  { id: 'mobile-nav-skeleton-2', width: '80%' },
  { id: 'mobile-nav-skeleton-3', width: '55%' },
  { id: 'mobile-nav-skeleton-4', width: '70%' },
];

/**
 * Skeleton placeholder for navigation drawer menu items.
 *
 * Renders animated skeleton rows inside the mobile drawer menu while CMS
 * navigation items are loading, preventing layout shifts and empty states.
 */
export const MenuItemSkeleton: React.FC<MenuItemSkeletonProps> = ({
  className,
  itemCount,
}) => {
  const items: readonly SkeletonItem[] = React.useMemo(() => {
    if (!itemCount) {
      return DEFAULT_SKELETON_ITEMS;
    }
    return Array.from({ length: itemCount }, (_, i) => ({
      id: `mobile-nav-skeleton-${i + 1}`,
      width: DEFAULT_SKELETON_ITEMS[i % DEFAULT_SKELETON_ITEMS.length].width,
    }));
  }, [itemCount]);

  return (
    <div
      className={classNames(styles.mobileNavSkeleton, className)}
      data-testid="mobile-nav-skeleton"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div key={item.id} className={styles.mobileNavSkeletonItem}>
          <SkeletonLine width={item.width} height="1.5rem" />
        </div>
      ))}
    </div>
  );
};

export default MenuItemSkeleton;
