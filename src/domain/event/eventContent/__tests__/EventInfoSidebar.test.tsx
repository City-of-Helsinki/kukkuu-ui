import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import EventInfoSidebar from '../EventInfoSidebar';

describe('EventInfoSidebar', () => {
  const baseEvent = {
    id: 'event-1',
    duration: 60,
  };

  const selectedOccurrence = {
    id: 'occ-1',
    time: '2026-10-04T10:00:00Z',
    occurrenceLanguage: 'FI',
    venue: {
      id: 'venue-1',
      name: 'Oodi Lastenmaailma',
      address: 'Töölönlahdenkatu 4',
    },
  };

  const otherOccurrences = [
    selectedOccurrence,
    {
      id: 'occ-2',
      time: '2026-10-11T12:00:00Z',
      occurrenceLanguage: 'FI',
      venue: {
        id: 'venue-1',
        name: 'Oodi Lastenmaailma',
        address: 'Töölönlahdenkatu 4',
      },
    },
    {
      id: 'occ-3',
      time: '2026-10-18T12:00:00Z',
      occurrenceLanguage: 'SV',
      venue: {
        id: 'venue-1',
        name: 'Oodi Lastenmaailma',
        address: 'Töölönlahdenkatu 4',
      },
    },
  ];

  it('renders all 4 sections with external map link and other occurrence navigation links', () => {
    render(
      <EventInfoSidebar
        event={baseEvent}
        selectedOccurrence={selectedOccurrence}
        otherOccurrences={otherOccurrences}
        childId="child-1"
      />
    );

    // 1. Päivä ja aika
    expect(screen.getByText('Päivä ja aika')).toBeInTheDocument();
    expect(screen.getByText('Su 4.10.2026')).toBeInTheDocument();
    expect(screen.getByText('13:00–14:00')).toBeInTheDocument();

    // 2. Paikka
    expect(screen.getByText('Paikka')).toBeInTheDocument();
    expect(screen.getByText('Oodi Lastenmaailma')).toBeInTheDocument();
    expect(screen.getByText('Töölönlahdenkatu 4')).toBeInTheDocument();
    const mapLink = screen.getByRole('link', { name: /Avaa kartta/i });
    expect(mapLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=T%C3%B6%C3%B6l%C3%B6nlahdenkatu%204'
    );
    expect(mapLink).toHaveAttribute('target', '_blank');
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');

    // 3. Kielet
    expect(screen.getByText('Kielet')).toBeInTheDocument();
    expect(screen.getByText('Suomi')).toBeInTheDocument();

    // 4. Tapahtuman muut ajat
    expect(screen.getByText('Tapahtuman muut ajat')).toBeInTheDocument();
    // occ-1 must not be listed in other times
    expect(
      screen.queryByRole('link', { name: /Su 4\.10\.2026/ })
    ).not.toBeInTheDocument();

    // occ-2 and occ-3 must be links with occurrenceId
    const occ2Link = screen.getByRole('link', { name: /Su 11\.10\.2026/ });
    expect(occ2Link).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1?occurrenceId=occ-2'
    );

    const occ3Link = screen.getByRole('link', { name: /Su 18\.10\.2026/ });
    expect(occ3Link).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1?occurrenceId=occ-3'
    );
  });

  it('strictly does not render any embedded map components', () => {
    const { container } = render(
      <EventInfoSidebar
        event={baseEvent}
        selectedOccurrence={selectedOccurrence}
        otherOccurrences={otherOccurrences}
        childId="child-1"
      />
    );

    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('.mapboxgl-map')).toBeNull();
    expect(container.querySelector('.leaflet-container')).toBeNull();
  });

  it('omits other occurrences section when no other upcoming occurrences exist', () => {
    render(
      <EventInfoSidebar
        event={baseEvent}
        selectedOccurrence={selectedOccurrence}
        otherOccurrences={[selectedOccurrence]}
        childId="child-1"
      />
    );

    expect(
      screen.queryByText('Tapahtuman muut ajat')
    ).not.toBeInTheDocument();
  });
});
