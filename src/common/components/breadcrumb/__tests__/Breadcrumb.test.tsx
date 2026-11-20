import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

import Breadcrumb, { BreadcrumbListItem } from '../Breadcrumb';

describe('Breadcrumb component', () => {
  const sampleList: BreadcrumbListItem[] = [
    { title: 'Etusivu', path: '/fi' },
    { title: 'Tapahtumat', path: '/fi/events?child=123' },
    { title: 'Vauvojen värikylpy', path: null },
  ];

  it('renders desktop and mobile navigation with correct links and active state', () => {
    render(
      <MemoryRouter>
        <Breadcrumb aria-label="Murupolku" list={sampleList} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: 'Murupolku' });
    expect(nav).toBeInTheDocument();

    // Check desktop links
    const homeLinks = screen.getAllByRole('link', { name: 'Etusivu' });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(homeLinks[0]).toHaveAttribute('href', '/fi');

    // Desktop and mobile parent links
    const eventLinks = screen.getAllByRole('link', { name: 'Tapahtumat' });
    expect(eventLinks.length).toBeGreaterThanOrEqual(1);
    expect(eventLinks[0]).toHaveAttribute('href', '/fi/events?child=123');

    // Check last active item has aria-current="page"
    const currentCrumb = screen.getByText('Vauvojen värikylpy');
    expect(currentCrumb).toHaveAttribute('aria-current', 'page');
  });

  it('renders custom className and HTML attributes', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          aria-label="Murupolku"
          list={sampleList}
          className="custom-breadcrumbs-class"
          data-testid="custom-breadcrumb"
        />
      </MemoryRouter>
    );

    const nav = screen.getByTestId('custom-breadcrumb');
    expect(nav).toHaveClass('custom-breadcrumbs-class');
    expect(nav).toHaveClass('hds-breadcrumb');
  });

  it('excludes the final crumb from mobile back-link selection even when its path is non-null', () => {
    const listWithFinalPath: BreadcrumbListItem[] = [
      { title: 'Etusivu', path: '/fi' },
      { title: 'Tapahtumat', path: '/fi/events' },
    ];

    render(
      <MemoryRouter>
        <Breadcrumb aria-label="Murupolku" list={listWithFinalPath} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('navigation', { name: 'Murupolku' })
    ).toBeInTheDocument();

    const homeLinks = screen.getAllByRole('link', { name: 'Etusivu' });
    expect(homeLinks).toHaveLength(2);
    homeLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/fi');
    });

    expect(
      screen.queryByRole('link', { name: 'Tapahtumat' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Tapahtumat')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
