import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import HomeHero from '../HomeHero';

describe('<HomeHero />', () => {
  it('renders static fallback title, description, and image when props are not provided', () => {
    render(
      <HomeHero
        userHasProfile={false}
        userIsAuthenticated={false}
        scrollToForm={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Kulttuurin kummilapset' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Kaikki vuodesta 2020 eteenpäin syntyvät helsinkiläiset lapset/
      )
    ).toBeInTheDocument();

    // The fallback hero image is decorative (alt=""), so it is presentational
    // rather than an image in the accessibility tree.
    const heroImg = screen.getByRole('presentation');
    expect(heroImg).toHaveAttribute('src', '/images/Culture_kids@2x.jpg');
    expect(heroImg).toHaveAttribute('fetchpriority', 'high');
  });

  it('renders hero title, description, image, and photographer credit when provided', () => {
    render(
      <HomeHero
        title="CMS Hero Otsikko"
        description="CMS Hero Kuvaus teksti"
        image={{
          url: 'https://example.com/cms-hero.jpg',
          altText: 'Lapset teatterissa',
          photographerName: 'Maija Meikäläinen',
        }}
        userHasProfile={false}
        userIsAuthenticated={false}
        scrollToForm={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'CMS Hero Otsikko' })
    ).toBeInTheDocument();
    expect(screen.getByText('CMS Hero Kuvaus teksti')).toBeInTheDocument();

    const heroImg = screen.getByRole('img', { name: 'Lapset teatterissa' });
    expect(heroImg).toHaveAttribute('src', 'https://example.com/cms-hero.jpg');
    expect(heroImg).toHaveAttribute('fetchpriority', 'high');
    expect(screen.getByText(/Maija Meikäläinen/)).toBeInTheDocument();
  });

  it('renders empty ingress without falling back when empty description is provided', () => {
    render(
      <HomeHero
        title="CMS Otsikko"
        description=""
        userHasProfile={false}
        userIsAuthenticated={false}
        scrollToForm={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'CMS Otsikko' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Kaikki vuodesta 2020 eteenpäin syntyvät helsinkiläiset lapset/
      )
    ).not.toBeInTheDocument();
  });

  it('renders accessible skeletons and no h1 or fallback image when isLoading is true', () => {
    const { container } = render(
      <HomeHero
        isLoading={true}
        userHasProfile={false}
        userIsAuthenticated={false}
        scrollToForm={vi.fn()}
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-image-skeleton')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton-line').length).toBeGreaterThan(0);
  });
});
