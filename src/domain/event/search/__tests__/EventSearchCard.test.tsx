import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import i18n from '../../../../common/translation/i18n/i18nInit';
import EventSearchCard from '../EventSearchCard';
import type { AvailableEvent } from '../../types/ChildAvailableOccurrencesTypes';
import { Language } from '../../../api/generatedTypes/graphql';

describe('EventSearchCard', () => {
  const baseEvent: AvailableEvent = {
    id: 'event-123',
    name: 'Musiikkiseikkailu',
    shortDescription: 'Ihanaa musiikkia koko perheelle',
    image: null,
    imageAltText: null,
    duration: 60,
    canChildEnroll: true,
    occurrences: {
      edges: [
        {
          node: {
            id: 'occ-1',
            time: '2026-10-04T10:00:00Z',
            remainingCapacity: 10,
            occurrenceLanguage: Language.Fi,
            venue: {
              id: 'venue-1',
              name: 'Annantalo',
              address: 'Annankatu 30',
            },
          },
        },
      ],
    },
  };

  it('renders event details, single occurrence time, venue, and action link', () => {
    render(<EventSearchCard childId="child-1" event={baseEvent} />);

    expect(screen.getByText('Musiikkiseikkailu')).toBeInTheDocument();
    expect(
      screen.getByText('Ihanaa musiikkia koko perheelle')
    ).toBeInTheDocument();
    expect(screen.getByText(/13:00–14:00/)).toBeInTheDocument();
    expect(screen.getByText('Annantalo, Annankatu 30')).toBeInTheDocument();
    expect(screen.getByText(/Kielet:\s*Suomi/)).toBeInTheDocument();
    expect(screen.queryByText('Esimerkkimerkki 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Esimerkkimerkki 2')).not.toBeInTheDocument();

    const actionLink = screen.getByRole('link', {
      name: 'Lue lisää',
    });
    expect(actionLink).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-123'
    );
  });

  it('renders date range and count when event has multiple upcoming occurrences', () => {
    const multiEvent: AvailableEvent = {
      ...baseEvent,
      occurrences: {
        edges: [
          baseEvent.occurrences.edges[0],
          {
            node: {
              id: 'occ-2',
              time: '2026-10-12T10:00:00Z',
              remainingCapacity: 5,
              occurrenceLanguage: Language.Sv,
              venue: {
                id: 'venue-2',
                name: 'Oodi',
                address: 'Töölönlahdenkatu 4',
              },
            },
          },
        ],
      },
    };

    render(<EventSearchCard childId="child-1" event={multiEvent} />);

    expect(screen.getByText(/4\.10\.2026 – 12\.10\.2026/)).toBeInTheDocument();
    expect(screen.getByText(/2 tapahtuma-aikaa/)).toBeInTheDocument();
    expect(screen.getByText('Annantalo, Oodi')).toBeInTheDocument();
    expect(screen.getByText(/Kielet:\s*Suomi,\s*Svenska/)).toBeInTheDocument();
  });

  it('renders read more button variant when canChildEnroll is false', () => {
    const unenrolledEvent: AvailableEvent = {
      ...baseEvent,
      canChildEnroll: false,
    };

    render(<EventSearchCard childId="child-1" event={unenrolledEvent} />);

    const actionLink = screen.getByRole('link', {
      name: 'Lue lisää',
    });
    expect(actionLink).toBeInTheDocument();
  });
  it('retains active locale prefix in detailsUrl for non-default languages', async () => {
    await i18n.changeLanguage('sv');
    try {
      render(<EventSearchCard childId="child-1" event={baseEvent} />);

      const actionLink = screen.getByRole('link');
      expect(actionLink).toHaveAttribute(
        'href',
        '/sv/profile/child/child-1/event/event-123',
      );
    } finally {
      await i18n.changeLanguage('fi');
    }
  });
});