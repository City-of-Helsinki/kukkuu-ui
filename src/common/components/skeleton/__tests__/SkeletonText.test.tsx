import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkeletonText from '../SkeletonText';

describe('SkeletonText', () => {
  it('renders default title and one description line with aria-hidden="true"', () => {
    render(<SkeletonText />);

    expect(screen.getByTestId('skeleton-text')).toBeInTheDocument();
    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(2);

    expect(lines[0]).toHaveStyle({
      width: '50%',
      height: 'var(--fontsize-heading-xl, 2.5rem)',
    });
    expect(lines[1]).toHaveStyle({
      width: '75%',
      height: '1.5rem',
    });
    lines.forEach((line) => {
      expect(line).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders custom number of description lines with specified widths', () => {
    render(
      <SkeletonText
        lines={3}
        lineWidths={['90%', '80%', '60%']}
        lineHeight="1.25rem"
        titleWidth="40%"
        titleHeight="3rem"
      />
    );

    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(4); // 1 title + 3 body lines

    expect(lines[0]).toHaveStyle({ width: '40%', height: '3rem' });
    expect(lines[1]).toHaveStyle({ width: '90%', height: '1.25rem' });
    expect(lines[2]).toHaveStyle({ width: '80%', height: '1.25rem' });
    expect(lines[3]).toHaveStyle({ width: '60%', height: '1.25rem' });
  });

  it('falls back to 100% width when description lines exceed lineWidths array', () => {
    render(<SkeletonText lines={3} lineWidths={['85%']} />);

    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(4);
    expect(lines[1]).toHaveStyle({ width: '85%' });
    expect(lines[2]).toHaveStyle({ width: '100%' });
    expect(lines[3]).toHaveStyle({ width: '100%' });
  });

  it('applies titleStyle, titleClassName, and container styling', () => {
    render(
      <SkeletonText
        className="custom-container-class"
        titleClassName="custom-title-class"
        titleStyle={{ marginTop: '20px' }}
      />
    );

    const container = screen.getByTestId('skeleton-text');
    expect(container).toHaveClass('custom-container-class');

    const [titleLine] = screen.getAllByTestId('skeleton-line');
    expect(titleLine).toHaveClass('custom-title-class');
    expect(titleLine).toHaveStyle({ marginTop: '20px' });
  });
});
