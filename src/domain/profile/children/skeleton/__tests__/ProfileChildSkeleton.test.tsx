import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProfileChildSkeleton from '../ProfileChildSkeleton';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'common.loading' ? 'Ladataan' : key),
  }),
}));

describe('ProfileChildSkeleton', () => {
  it('renders skeleton with accessibility attributes', () => {
    render(<ProfileChildSkeleton />);

    const skeleton = screen.getByTestId('profile-child-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    expect(skeleton).toHaveAttribute('aria-label', 'Ladataan');
  });

  it('renders with custom className if provided', () => {
    render(<ProfileChildSkeleton className="custom-test-class" />);

    const skeleton = screen.getByTestId('profile-child-skeleton');
    expect(skeleton.className).toContain('custom-test-class');
  });
});
