import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders skeleton and sets aria-busy="true" on wrapper when isLoading is true', () => {
    render(
      <SkeletonLoader
        isLoading={true}
        skeleton={<div data-testid="test-skeleton">Loading skeleton</div>}
      >
        <div data-testid="real-content">Real content</div>
      </SkeletonLoader>
    );

    const busyWrapper = document.querySelector('[aria-busy="true"]');
    expect(busyWrapper).toBeInTheDocument();
    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('real-content')).not.toBeInTheDocument();
  });

  it('renders children and omits aria-busy when isLoading is false', () => {
    render(
      <SkeletonLoader
        isLoading={false}
        skeleton={<div data-testid="test-skeleton">Loading skeleton</div>}
      >
        <div data-testid="real-content">Real content</div>
      </SkeletonLoader>
    );

    expect(document.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
    expect(screen.getByTestId('real-content')).toBeInTheDocument();
    expect(screen.queryByTestId('test-skeleton')).not.toBeInTheDocument();
  });

  it('evaluates children function lazily only when isLoading is false', () => {
    const renderContent = vi.fn(() => (
      <div data-testid="lazy-content">Computed content</div>
    ));

    const { rerender } = render(
      <SkeletonLoader
        isLoading={true}
        skeleton={<div data-testid="test-skeleton">Skeleton</div>}
      >
        {renderContent}
      </SkeletonLoader>
    );

    expect(renderContent).not.toHaveBeenCalled();
    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();

    rerender(
      <SkeletonLoader
        isLoading={false}
        skeleton={<div data-testid="test-skeleton">Skeleton</div>}
      >
        {renderContent}
      </SkeletonLoader>
    );

    expect(renderContent).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
  });

  it('renders with custom container element via as prop', () => {
    render(
      <SkeletonLoader
        isLoading={true}
        as="section"
        data-testid="custom-container"
        skeleton={<div>Skeleton</div>}
      >
        <div>Content</div>
      </SkeletonLoader>
    );

    const section = screen.getByTestId('custom-container');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('aria-busy', 'true');
  });

  it('omits container element when as is null or React.Fragment', () => {
    const { rerender } = render(
      <div data-testid="parent">
        <SkeletonLoader
          isLoading={true}
          as={null}
          skeleton={<span data-testid="child-skeleton">Skeleton</span>}
        >
          <span>Content</span>
        </SkeletonLoader>
      </div>
    );

    const parent = screen.getByTestId('parent');
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toHaveAttribute('data-testid', 'child-skeleton');

    rerender(
      <div data-testid="parent">
        <SkeletonLoader
          isLoading={true}
          as={React.Fragment}
          skeleton={<span data-testid="child-skeleton">Skeleton</span>}
        >
          <span>Content</span>
        </SkeletonLoader>
      </div>
    );

    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toHaveAttribute('data-testid', 'child-skeleton');
  });

  it('forwards custom className and data attributes to container', () => {
    render(
      <SkeletonLoader
        isLoading={false}
        className="custom-class"
        data-testid="loader-container"
        skeleton={<div>Skeleton</div>}
      >
        <div>Content</div>
      </SkeletonLoader>
    );

    const container = screen.getByTestId('loader-container');
    expect(container).toHaveClass('custom-class');
    expect(container).not.toHaveAttribute('aria-busy');
  });
});
