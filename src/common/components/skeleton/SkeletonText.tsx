import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import { SkeletonLine } from './CmsSkeleton';
import styles from './cmsSkeleton.module.scss';

export interface SkeletonTextProps {
  /** Width of the heading line. Default '50%'. */
  titleWidth?: string | number;
  /** Height of the heading line. Default 'var(--fontsize-heading-xl, 2.5rem)'. */
  titleHeight?: string | number;
  /** Optional className for the title SkeletonLine. */
  titleClassName?: string;
  /** Optional style for the title SkeletonLine. */
  titleStyle?: CSSProperties;
  /** Number of body description lines. Default 1. */
  lines?: number;
  /** Specific widths for description lines. If fewer than lines, remaining default to '100%'. */
  lineWidths?: (string | number)[];
  /** Height of each description line. Default '1.5rem'. */
  lineHeight?: string | number;
  /** Optional className for the container div. */
  className?: string;
  /** Optional style for the container div. */
  style?: CSSProperties;
}

/**
 * Standardized typography skeleton rendering a title line and optional description lines.
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  titleWidth = '50%',
  titleHeight = 'var(--fontsize-heading-xl, 2.5rem)',
  titleClassName,
  titleStyle,
  lines = 1,
  lineWidths = ['75%'],
  lineHeight = '1.5rem',
  className,
  style,
}) => (
  <div
    className={classNames(styles.skeletonText, className)}
    style={style}
    data-testid="skeleton-text"
  >
    <SkeletonLine
      width={titleWidth}
      height={titleHeight}
      className={classNames(styles.skeletonTextTitle, titleClassName)}
      style={titleStyle}
    />
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLine
        key={index}
        width={lineWidths[index] ?? '100%'}
        height={lineHeight}
      />
    ))}
  </div>
);

export default SkeletonText;
