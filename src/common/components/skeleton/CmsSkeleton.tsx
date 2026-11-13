import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import styles from './cmsSkeleton.module.scss';

export interface SkeletonLineProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Presentational text line skeleton placeholder.
 *
 * Used to reserve layout space for headings and body paragraphs while CMS data
 * is in flight. Explicitly marked with `aria-hidden="true"` so assistive technologies
 * ignore placeholder shapes, while the containing section communicates loading via `aria-busy`.
 */
export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = '1.25rem',
  className,
  style,
}) => (
  <div
    aria-hidden="true"
    className={classNames(styles.line, className)}
    style={{ width, height, ...style }}
    data-testid="skeleton-line"
  />
);

export interface HeroImageSkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Summer-colored skeleton placeholder for CMS hero images.
 *
 * Renders a warm `var(--color-summer)` background with motion-safe shimmer,
 * reserving layout height in the hero banner without downloading heavy fallback images.
 * Marked with `aria-hidden="true"` as decorative loading presentation.
 */
export const HeroImageSkeleton: React.FC<HeroImageSkeletonProps> = ({
  className,
  style,
}) => (
  <div
    aria-hidden="true"
    className={classNames(styles.heroImage, className)}
    style={style}
    data-testid="hero-image-skeleton"
  />
);

export interface NavPillSkeletonProps {
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Navigation pill skeleton placeholder for header menu items.
 *
 * Preserves the exact height and horizontal flow of navigation menu links,
 * preventing Cumulative Layout Shift (CLS) when menu queries resolve.
 */
export const NavPillSkeleton: React.FC<NavPillSkeletonProps> = ({
  width = '6rem',
  className,
  style,
}) => (
  <div
    aria-hidden="true"
    className={classNames(styles.pill, className)}
    style={{ width, ...style }}
    data-testid="nav-pill-skeleton"
  />
);

export interface FooterPillSkeletonProps {
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Footer link skeleton placeholder for CMS footer navigation.
 *
 * Keeps footer dimensions and alignment stable while CMS footer menu links load.
 */
export const FooterPillSkeleton: React.FC<FooterPillSkeletonProps> = ({
  width = '7rem',
  className,
  style,
}) => (
  <div
    aria-hidden="true"
    className={classNames(styles.footerPill, className)}
    style={{ width, ...style }}
    data-testid="footer-pill-skeleton"
  />
);

export { default as SkeletonLoader } from './SkeletonLoader';
export type { SkeletonLoaderProps } from './SkeletonLoader';
export { default as SkeletonText } from './SkeletonText';
export type { SkeletonTextProps } from './SkeletonText';

