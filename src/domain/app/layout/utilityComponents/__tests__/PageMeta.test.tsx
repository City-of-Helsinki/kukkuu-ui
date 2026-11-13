import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import PageMeta from '../PageMeta';

const renderWithHelmet = (ui: React.ReactElement) =>
  render(<HelmetProvider>{ui}</HelmetProvider>);

describe('<PageMeta />', () => {
  it('renders standard twitter:card and canonical links', async () => {
    renderWithHelmet(
      <PageMeta
        title="Testisivu"
        description="Kuvaus sivulle"
      />
    );

    await waitFor(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeInTheDocument();
    });
  });

  it('renders alternate links based on page translations when available', async () => {
    const pageWithTranslations = {
      uri: '/fi/sivu',
      translations: [
        {
          language: { code: 'SV', slug: 'sv' },
          uri: '/sv/sida',
        },
        {
          language: { code: 'EN', slug: 'en' },
          uri: '/en/page',
        },
      ],
    };

    renderWithHelmet(
      <PageMeta
        title="Kieliversiot"
        page={pageWithTranslations as any}
      />
    );

    await waitFor(() => {
      const svAlternate = document.querySelector(
        'link[rel="alternate"][hreflang="sv"]'
      );
      expect(svAlternate).toHaveAttribute(
        'href',
        expect.stringContaining('/sv/sida')
      );

      const enAlternate = document.querySelector(
        'link[rel="alternate"][hreflang="en"]'
      );
      expect(enAlternate).toHaveAttribute(
        'href',
        expect.stringContaining('/en/page')
      );
    });
  });
});
