import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';

import Link from '../Link';
import AppConfig from '../../../../domain/app/AppConfig';

describe('Link component', () => {
  beforeEach(() => {
    vi.spyOn(AppConfig, 'origin', 'get').mockReturnValue('https://kukkuu.fi');
  });

  it('renders a React Router link for internal relative href within router context', () => {
    render(
      <MemoryRouter>
        <Link href="/fi/events">Tapahtumat</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Tapahtumat' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/fi/events');
  });

  it('renders a React Router link when to prop is supplied', () => {
    render(
      <MemoryRouter>
        <Link to="/fi/profile">Profiili</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Profiili' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/fi/profile');
  });

  it('normalizes internal absolute URL matching app origin into relative router path', () => {
    render(
      <MemoryRouter>
        <Link href="https://kukkuu.fi/fi/events?child=123">Tapahtumat</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Tapahtumat' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/fi/events?child=123');
  });

  it('renders standard native <a> tag for external URL', () => {
    render(
      <MemoryRouter>
        <Link href="https://hel.fi">Helsingin kaupunki</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Helsingin kaupunki' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://hel.fi');
  });

  it('renders standard native <a> tag when target is _blank even for internal href', () => {
    render(
      <MemoryRouter>
        <Link href="/fi/terms" target="_blank" rel="noopener noreferrer">
          Ehdot
        </Link>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Ehdot' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/fi/terms');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('gracefully renders native <a> tag when rendered outside a router context', () => {
    render(<Link href="/fi/events">Tapahtumat</Link>);

    const link = screen.getByRole('link', { name: 'Tapahtumat' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/fi/events');
  });

  it('preserves pathname, search, and hash for object-form to prop in RouterLink and native fallback', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Link
          to={{
            pathname: 'https://kukkuu.fi/fi/events',
            search: '?child=123',
            hash: '#details',
          }}
        >
          Router-linkki
        </Link>
      </MemoryRouter>
    );

    const routerLink = screen.getByRole('link', { name: 'Router-linkki' });
    expect(routerLink).toHaveAttribute(
      'href',
      '/fi/events?child=123#details'
    );

    rerender(
      <MemoryRouter>
        <Link
          to={{
            pathname: 'https://hel.fi/fi/events',
            search: '?child=123',
            hash: '#details',
          }}
        >
          Ulkoinen linkki
        </Link>
      </MemoryRouter>
    );

    const nativeLink = screen.getByRole('link', { name: 'Ulkoinen linkki' });
    expect(nativeLink).toHaveAttribute(
      'href',
      'https://hel.fi/fi/events?child=123#details'
    );
  });
});
