import React from 'react';

export interface SkeletonLoaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Whether the content is currently in initial loading state. */
  isLoading: boolean;
  /** Skeleton placeholder element to render while loading. */
  skeleton: React.ReactNode;
  /** Real content to render once loading completes (or render function for lazy evaluation). */
  children?: React.ReactNode | (() => React.ReactNode);
  /**
   * HTML tag or component for wrapper container.
   * Pass null or React.Fragment to omit the container element.
   * @default 'div'
   */
  as?: React.ElementType | null;
  /** Optional container className. */
  className?: string;
  /** Test identifier. */
  'data-testid'?: string;
}

/**
 * Declarative loader wrapper that conditionally renders skeleton placeholders
 * or resolved children, managing accessible aria-busy attributes automatically.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  isLoading,
  skeleton,
  children,
  as: Component = 'div',
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const content = isLoading
    ? skeleton
    : typeof children === 'function'
      ? children()
      : children;

  if (!Component || Component === React.Fragment) {
    return <>{content}</>;
  }

  return (
    <Component
      aria-busy={isLoading ? 'true' : undefined}
      className={className}
      data-testid={testId}
      {...restProps}
    >
      {content}
    </Component>
  );
};

export default SkeletonLoader;
