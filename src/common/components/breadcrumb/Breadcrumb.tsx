import React from 'react';
import classNames from 'classnames';
import { IconAngleLeft, IconAngleRight, IconSize } from 'hds-react';
import 'hds-core/lib/components/breadcrumb/breadcrumb.css';
import 'hds-core/lib/components/link/link.css';

import Link from '../link/Link';
import styles from './breadcrumb.module.scss';

export type BreadcrumbListItem = {
  title: string;
  path: string | null;
};

export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  'aria-label': string;
  list: BreadcrumbListItem[];
  className?: string;
  contained?: boolean;
}

/**
 * Accessible Breadcrumb navigation component that directly renders React Router Link
 * components for client-side navigation (preserving Apollo cache), styled with
 * Helsinki Design System (HDS) design tokens and responsive markup.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  'aria-label': ariaLabel,
  list,
  className,
  contained = false,
  ...rest
}) => {
  // Find the last item before the current crumb with a path for mobile back navigation
  const parentItem = list
    .slice(0, -1)
    .reduceRight<BreadcrumbListItem | undefined>(
      (acc, item) => acc || (item.path ? item : undefined),
      undefined
    );

  const nav = (
    <nav
      aria-label={ariaLabel}
      className={classNames(
        'hds-breadcrumb',
        contained && styles.breadcrumbs,
        className
      )}
      {...rest}
    >
      <ol className="hds-breadcrumb__list hds-breadcrumb__list--desktop">
        {list.map((item, index) => {
          const isLast = index === list.length - 1;
          const hasPath = Boolean(item.path);

          return (
            <li
              key={`${index}-${item.path ?? ''}-${item.title}`}
              className="hds-breadcrumb__list-item"
            >
              {hasPath && !isLast ? (
                <Link
                  href={item.path}
                  className="hds-link hds-breadcrumb__link"
                >
                  {item.title}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="hds-breadcrumb__list-item--active"
                >
                  {item.title}
                </span>
              )}
              {!isLast && (
                <span
                  className="hds-breadcrumb__separator"
                  aria-hidden="true"
                >
                  <IconAngleRight size={IconSize.ExtraSmall} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {parentItem?.path && (
        <div className="hds-breadcrumb__list hds-breadcrumb__list--mobile">
          <span className="hds-breadcrumb__back-arrow" aria-hidden="true">
            <IconAngleLeft size={IconSize.Small} />
          </span>
          <Link
            href={parentItem.path}
            className="hds-link hds-breadcrumb__link"
          >
            {parentItem.title}
          </Link>
        </div>
      )}
    </nav>
  );

  if (contained) {
    return <div className={styles.breadcrumbsWrapper}>{nav}</div>;
  }

  return nav;
};

export default Breadcrumb;
