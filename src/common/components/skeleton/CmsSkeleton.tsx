import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { Koros } from 'hds-react';

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

export interface CmsPageSkeletonProps {
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

/**
 * Accessible full-width skeleton placeholder for CMS dynamic subpages and article pages.
 *
 * Faithfully mirrors the Helsinki Design System subpage layout:
 * - Breadcrumb navigation placeholder
 * - Full-width summer yellow hero with title, lead description, and bottom Koros wave
 * - Multi-paragraph white content body with subheadings
 */
export const CmsPageSkeleton: React.FC<CmsPageSkeletonProps> = ({
  className,
  style,
  'data-testid': testId = 'cms-page-skeleton',
}) => (
  <div
    aria-busy="true"
    className={classNames(styles.pageSkeletonWrapper, className)}
    style={style}
    data-testid={testId}
  >
    <div className={styles.pageSkeletonBreadcrumbContainer}>
      <SkeletonLine width="14rem" height="1.25rem" />
    </div>

    <div className={styles.pageSkeletonHero}>
      <div className={styles.pageSkeletonHeroContainer}>
        <SkeletonLine
          width="50%"
          height="3rem"
          className={styles.heroTitleLine}
        />
        <SkeletonLine
          width="75%"
          height="1.25rem"
          className={styles.heroDescLine}
        />
        <SkeletonLine
          width="55%"
          height="1.25rem"
          className={styles.heroDescLine}
        />
      </div>
      <Koros
        type="basic"
        flipVertical
        className={styles.pageSkeletonHeroKoros}
        style={{ fill: 'var(--color-summer, #ffc61e)' }}
      />
    </div>

    <div className={styles.pageSkeletonContentContainer}>
      <SkeletonLine
        width="35%"
        height="2rem"
        className={styles.contentHeadingLine}
      />
      <div className={styles.paragraphGroup}>
        <SkeletonLine width="100%" height="1.25rem" />
        <SkeletonLine width="95%" height="1.25rem" />
        <SkeletonLine width="98%" height="1.25rem" />
        <SkeletonLine width="70%" height="1.25rem" />
      </div>
      <div className={styles.paragraphGroup}>
        <SkeletonLine width="100%" height="1.25rem" />
        <SkeletonLine width="92%" height="1.25rem" />
        <SkeletonLine width="85%" height="1.25rem" />
        <SkeletonLine width="60%" height="1.25rem" />
      </div>

      <SkeletonLine
        width="25%"
        height="1.75rem"
        className={styles.subheadingLine}
      />
      <div className={styles.paragraphGroup}>
        <SkeletonLine width="100%" height="1.25rem" />
        <SkeletonLine width="96%" height="1.25rem" />
        <SkeletonLine width="88%" height="1.25rem" />
        <SkeletonLine width="65%" height="1.25rem" />
      </div>

      <SkeletonLine
        width="20%"
        height="1.75rem"
        className={styles.subheadingLine}
      />
      <div className={styles.paragraphGroup}>
        <SkeletonLine width="100%" height="1.25rem" />
        <SkeletonLine width="94%" height="1.25rem" />
        <SkeletonLine width="80%" height="1.25rem" />
        <SkeletonLine width="50%" height="1.25rem" />
      </div>
    </div>
  </div>
);

export { default as SkeletonLoader } from './SkeletonLoader';
export type { SkeletonLoaderProps } from './SkeletonLoader';
export { default as SkeletonText } from './SkeletonText';
export type { SkeletonTextProps } from './SkeletonText';

