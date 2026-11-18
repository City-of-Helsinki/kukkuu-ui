import React from 'react';
import classNames from 'classnames';

import { NavPillSkeleton } from '../../../common/components/skeleton/CmsSkeleton';
import styles from './navigation.module.scss';

export type NavMenuSkeletonProps = Readonly<{
  className?: string;
  pillWidths?: readonly (string | number)[];
}>;

const DEFAULT_PILL_WIDTHS: readonly (string | number)[] = [
  '6rem',
  '7.5rem',
  '6.5rem',
];

/**
 * Skeleton placeholder bar for desktop navigation menu links.
 *
 * Preserves the height, max-width, and horizontal flow of `Header.NavigationMenu`,
 * preventing Cumulative Layout Shift (CLS) when CMS header menus are loading.
 */
export const NavMenuSkeleton: React.FC<NavMenuSkeletonProps> = ({
  className,
  pillWidths = DEFAULT_PILL_WIDTHS,
}) => {
  const pills = React.useMemo(
    () =>
      pillWidths.map((width, index) => ({
        id: `nav-pill-skeleton-${index}`,
        width,
      })),
    [pillWidths]
  );

  return (
    <div
      className={classNames(styles.navSkeletonBar, className)}
      data-testid="nav-menu-skeleton"
      aria-hidden="true"
    >
      <div className={styles.navSkeletonRow}>
        {pills.map((pill) => (
          <NavPillSkeleton key={pill.id} width={pill.width} />
        ))}
      </div>
    </div>
  );
};

export const NavigationMenuSkeleton = NavMenuSkeleton;

export default NavMenuSkeleton;
