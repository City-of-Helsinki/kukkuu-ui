import { render, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import useRHHCConfig from '../useRHHCConfig';

describe('useRHHCConfig', () => {
  it('configures A and Link components with prefetch="intent"', () => {
    const { result } = renderHook(() => useRHHCConfig(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const AComponent = result.current.components?.A;
    const LinkComponent = result.current.components?.Link;

    expect(AComponent).toBeDefined();
    expect(LinkComponent).toBeDefined();

    const aElement = AComponent!({
      href: '/fi/pages/tietoa',
      children: 'Tietoa meistä',
    });
    expect(aElement.props.prefetch).toBe('intent');
    expect(aElement.props.to).toBe('/fi/pages/tietoa');

    const linkElement = LinkComponent!({
      href: '/fi/articles/artikkeli',
      children: 'Lue artikkeli',
    });
    expect(linkElement.props.prefetch).toBe('intent');
    expect(linkElement.props.to).toBe('/fi/articles/artikkeli');

    const { container } = render(
      <MemoryRouter>
        {aElement}
        {linkElement}
      </MemoryRouter>
    );

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/fi/pages/tietoa');
    expect(links[1]).toHaveAttribute('href', '/fi/articles/artikkeli');
  });

  it('handles empty or missing href gracefully and passes additional HTML attributes', () => {
    const { result } = renderHook(() => useRHHCConfig(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const AComponent = result.current.components?.A;
    const aElement = AComponent!({
      className: 'custom-link-class',
      'aria-label': 'Custom Link',
      children: 'Link with no href',
    });

    expect(aElement.props.to).toBe('');
    expect(aElement.props.prefetch).toBe('intent');
    expect(aElement.props.className).toBe('custom-link-class');
    expect(aElement.props['aria-label']).toBe('Custom Link');

    const { container } = render(<MemoryRouter>{aElement}</MemoryRouter>);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('class', 'custom-link-class');
    expect(link).toHaveAttribute('aria-label', 'Custom Link');
  });
});
