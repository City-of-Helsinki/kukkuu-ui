import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import HomeInstructions from '../HomeInstructions';
import { publicSvgIconPaths } from '../../../../public_files';

describe('<HomeInstructions />', () => {
  it('renders both section headings', () => {
    render(<HomeInstructions />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Mitä toiminta tarjoaa?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Millaisia tapahtumat ovat?',
      })
    ).toBeInTheDocument();
  });

  it('renders all three cards for section 1 with correct titles and descriptions', () => {
    render(<HomeInstructions />);

    expect(
      screen.getByRole('heading', { level: 3, name: '0–6-vuotiaille' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Jos lapsi asuu Helsingissä ja on 0–6-vuotias/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Kahdesti vuodessa' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Saat sähköpostiisi kaksi kertaa vuodessa kutsun/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Tukea kasvuun' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Voit kokea lapsen kanssa hauskoja, yhteisiä hetkiä kulttuurin parissa/
      )
    ).toBeInTheDocument();
  });

  it('renders all three cards for section 2 with correct titles and descriptions', () => {
    render(<HomeInstructions />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Kolme teemapolkua' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Voitte valita tapahtumia kolmesta teemapolusta/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Erilaisille perheille' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Suurin osa tapahtumista on tarkoitettu lapselle ja yhdelle aikuiselle/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Tutustumistapahtumat' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Voitte tutustua toimintaan myös tutustumistapahtumassa/
      )
    ).toBeInTheDocument();
  });

  it('renders the "Tietoa eri kielillä" button linking to the CMS page', () => {
    render(<HomeInstructions />);

    const languageLink = screen.getByRole('link', {
      name: 'Tietoa eri kielillä',
    });
    expect(languageLink).toBeInTheDocument();
    expect(languageLink).toHaveAttribute(
      'href',
      '/fi/pages/tietoa-eri-kielilla'
    );
  });

  it('renders the 6 instruction icons', () => {
    const { container } = render(<HomeInstructions />);

    const images = container.querySelectorAll('img');
    const sources = Array.from(images).map((img) => img.getAttribute('src'));

    expect(sources).toContain(publicSvgIconPaths.homeAge);
    expect(sources).toContain(publicSvgIconPaths.homeTicket);
    expect(sources).toContain(publicSvgIconPaths.homeGrowth);
    expect(sources).toContain(publicSvgIconPaths.homeThemes);
    expect(sources).toContain(publicSvgIconPaths.homeFamilies);
    expect(sources).toContain(publicSvgIconPaths.homeIntro);
  });
});
