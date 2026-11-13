import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  SkeletonLine,
  HeroImageSkeleton,
  NavPillSkeleton,
  FooterPillSkeleton,
} from '../CmsSkeleton';

describe('CmsSkeleton primitives', () => {
  describe('SkeletonLine', () => {
    it('renders with aria-hidden="true" and default dimensions', () => {
      render(<SkeletonLine />);
      const el = screen.getByTestId('skeleton-line');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-hidden', 'true');
      expect(el).toHaveStyle({ width: '100%', height: '1.25rem' });
    });

    it('applies custom width, height, and className', () => {
      render(
        <SkeletonLine
          width="50%"
          height="2.5rem"
          className="custom-line-class"
        />
      );
      const el = screen.getByTestId('skeleton-line');
      expect(el).toHaveStyle({ width: '50%', height: '2.5rem' });
      expect(el.className).toContain('custom-line-class');
    });
  });

  describe('HeroImageSkeleton', () => {
    it('renders with aria-hidden="true"', () => {
      render(<HeroImageSkeleton />);
      const el = screen.getByTestId('hero-image-skeleton');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies custom className and style', () => {
      render(
        <HeroImageSkeleton
          className="custom-hero-class"
          style={{ maxHeight: '300px' }}
        />
      );
      const el = screen.getByTestId('hero-image-skeleton');
      expect(el.className).toContain('custom-hero-class');
      expect(el).toHaveStyle({ maxHeight: '300px' });
    });
  });

  describe('NavPillSkeleton', () => {
    it('renders with aria-hidden="true" and custom width', () => {
      render(<NavPillSkeleton width="8rem" className="custom-nav-pill" />);
      const el = screen.getByTestId('nav-pill-skeleton');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-hidden', 'true');
      expect(el).toHaveStyle({ width: '8rem' });
      expect(el.className).toContain('custom-nav-pill');
    });
  });

  describe('FooterPillSkeleton', () => {
    it('renders with aria-hidden="true" and custom width', () => {
      render(<FooterPillSkeleton width="9rem" className="custom-footer-pill" />);
      const el = screen.getByTestId('footer-pill-skeleton');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-hidden', 'true');
      expect(el).toHaveStyle({ width: '9rem' });
      expect(el.className).toContain('custom-footer-pill');
    });
  });
});
