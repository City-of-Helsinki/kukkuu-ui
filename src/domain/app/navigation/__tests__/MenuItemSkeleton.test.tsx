import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MenuItemSkeleton from '../MenuItemSkeleton';

describe('<MenuItemSkeleton />', () => {
  it('renders mobile navigation skeleton container and default 4 skeleton lines', () => {
    render(<MenuItemSkeleton />);

    const skeletonContainer = screen.getByTestId('mobile-nav-skeleton');
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer).toHaveAttribute('aria-hidden', 'true');

    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(4);
    expect(lines[0]).toHaveStyle({ width: '65%' });
    expect(lines[1]).toHaveStyle({ width: '80%' });
    expect(lines[2]).toHaveStyle({ width: '55%' });
    expect(lines[3]).toHaveStyle({ width: '70%' });
  });

  it('renders custom count of skeleton items when itemCount prop is passed', () => {
    render(<MenuItemSkeleton itemCount={6} />);

    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(6);
  });

  it('supports custom className prop', () => {
    render(<MenuItemSkeleton className="custom-skeleton-class" />);

    const skeletonContainer = screen.getByTestId('mobile-nav-skeleton');
    expect(skeletonContainer).toHaveClass('custom-skeleton-class');
  });
});
