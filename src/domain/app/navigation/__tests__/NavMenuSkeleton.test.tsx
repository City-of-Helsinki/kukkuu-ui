import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NavMenuSkeleton from '../NavMenuSkeleton';

describe('<NavMenuSkeleton />', () => {
  it('renders desktop navigation menu skeleton bar with 3 default pills', () => {
    render(<NavMenuSkeleton />);

    const skeletonBar = screen.getByTestId('nav-menu-skeleton');
    expect(skeletonBar).toBeInTheDocument();
    expect(skeletonBar).toHaveAttribute('aria-hidden', 'true');

    const pills = screen.getAllByTestId('nav-pill-skeleton');
    expect(pills).toHaveLength(3);
    expect(pills[0]).toHaveStyle({ width: '6rem' });
    expect(pills[1]).toHaveStyle({ width: '7.5rem' });
    expect(pills[2]).toHaveStyle({ width: '6.5rem' });
  });

  it('renders custom pill widths when provided', () => {
    render(<NavMenuSkeleton pillWidths={['5rem', '8rem', '10rem', '6rem']} />);

    const pills = screen.getAllByTestId('nav-pill-skeleton');
    expect(pills).toHaveLength(4);
    expect(pills[0]).toHaveStyle({ width: '5rem' });
    expect(pills[1]).toHaveStyle({ width: '8rem' });
    expect(pills[2]).toHaveStyle({ width: '10rem' });
    expect(pills[3]).toHaveStyle({ width: '6rem' });
  });

  it('applies custom className to skeleton bar', () => {
    render(<NavMenuSkeleton className="custom-skeleton-bar" />);

    const skeletonBar = screen.getByTestId('nav-menu-skeleton');
    expect(skeletonBar).toHaveClass('custom-skeleton-bar');
  });
});
