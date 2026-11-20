import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

import {
  SkeletonLine,
  HeroImageSkeleton,
  NavPillSkeleton,
  FooterPillSkeleton,
  BreadcrumbSkeleton,
  CmsPageSkeleton,
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
      render(
        <FooterPillSkeleton width="9rem" className="custom-footer-pill" />
      );
      const el = screen.getByTestId('footer-pill-skeleton');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-hidden', 'true');
      expect(el).toHaveStyle({ width: '9rem' });
      expect(el.className).toContain('custom-footer-pill');
    });
  });

  describe('BreadcrumbSkeleton', () => {
    it('renders single line placeholder when rootTitle is not provided with localized loading aria-label', () => {
      render(<BreadcrumbSkeleton />);
      const nav = screen.getByTestId('breadcrumb-skeleton');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Ladataan murupolkua');
      expect(screen.getByTestId('skeleton-line')).toBeInTheDocument();
    });

    it('renders static rootTitle with leaf skeleton when rootTitle is provided', () => {
      render(<BreadcrumbSkeleton rootTitle="Etusivu" rootPath="/fi" />);
      const nav = screen.getByTestId('breadcrumb-skeleton');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Ladataan murupolkua');
      const link = screen.getByRole('link', { name: 'Etusivu' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/fi');
      expect(screen.getByTestId('skeleton-line')).toBeInTheDocument();
    });

    it('renders router link when rendered within router context', () => {
      render(
        <MemoryRouter>
          <BreadcrumbSkeleton rootTitle="Etusivu" rootPath="/fi" />
        </MemoryRouter>
      );
      const link = screen.getByRole('link', { name: 'Etusivu' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/fi');
    });

    it('accepts custom aria-label and ariaLabel override props', () => {
      const { rerender } = render(
        <BreadcrumbSkeleton aria-label="Custom breadcrumb label" />
      );
      expect(screen.getByTestId('breadcrumb-skeleton')).toHaveAttribute(
        'aria-label',
        'Custom breadcrumb label'
      );

      rerender(<BreadcrumbSkeleton ariaLabel="Another custom label" />);
      expect(screen.getByTestId('breadcrumb-skeleton')).toHaveAttribute(
        'aria-label',
        'Another custom label'
      );
    });
  });

  describe('CmsPageSkeleton', () => {
    it('renders accessible full-width subpage skeleton with aria-busy and koros', () => {
      render(<CmsPageSkeleton />);
      const el = screen.getByTestId('cms-page-skeleton');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('aria-busy', 'true');

      // Verify breadcrumb, hero lines, and multiple content lines are rendered
      const skeletonLines = screen.getAllByTestId('skeleton-line');
      expect(skeletonLines.length).toBeGreaterThanOrEqual(10);
    });

    it('applies custom testid, className, and style', () => {
      render(
        <CmsPageSkeleton
          data-testid="custom-page-skeleton"
          className="custom-page-skeleton-class"
          style={{ opacity: 0.9 }}
        />
      );
      const el = screen.getByTestId('custom-page-skeleton');
      expect(el).toBeInTheDocument();
      expect(el.className).toContain('custom-page-skeleton-class');
      expect(el).toHaveStyle({ opacity: '0.9' });
    });
  });
});
