import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import EventHero from '../EventHero';

describe('EventHero', () => {
  const baseEvent = {
    id: 'event-1',
    name: 'Sirkusseikkailu',
    shortDescription: 'Iloista akrobatiaa perheen pienimmille',
    image: null,
    imageAltText: null,
    duration: 60,
    canChildEnroll: true,
  };

  const baseOccurrence = {
    id: 'occ-1',
    time: '2026-10-04T10:00:00Z',
    remainingCapacity: 5,
    occurrenceLanguage: 'FI',
    venue: {
      id: 'venue-1',
      name: 'Kaapelitehdas',
      address: 'Kaapeliaukio 3',
    },
  };

  it('renders hero title, short description, date, venue, language and badges', () => {
    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    expect(screen.getByText('Sirkusseikkailu')).toBeInTheDocument();
    expect(
      screen.getByText('Iloista akrobatiaa perheen pienimmille')
    ).toBeInTheDocument();
    expect(screen.getByText('Su 4.10.2026, 13:00–14:00')).toBeInTheDocument();
    expect(
      screen.getByText('Kaapelitehdas, Kaapeliaukio 3')
    ).toBeInTheDocument();
    expect(screen.getByText(/Kielet:\s*Suomi/)).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 1')).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 2')).toBeInTheDocument();
  });

  it('renders enabled enrolment button when child can enroll and spots remain, opening modal on click', () => {
    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const enrolButton = screen.getByRole('button', { name: 'Ilmoittaudu' });
    expect(enrolButton).toBeInTheDocument();
    expect(enrolButton).toBeEnabled();

    fireEvent.click(enrolButton);

    expect(
      screen.getByRole('dialog', { name: 'Vahvista ilmoittautuminen' })
    ).toBeInTheDocument();
  });

  it('renders disabled enrolment button when child cannot enroll', () => {
    render(
      <EventHero
        event={{ ...baseEvent, canChildEnroll: false }}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const button = screen.getByRole('button', { name: 'Ilmoittaudu' });
    expect(button).toBeDisabled();
  });

  it('renders image when provided', () => {
    render(
      <EventHero
        event={{
          ...baseEvent,
          image: 'https://example.com/sirkus.jpg',
          imageAltText: 'Sirkuskuva',
        }}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const img = screen.getByRole('img', { name: 'Sirkuskuva' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveStyle({
      backgroundImage: 'url(https://example.com/sirkus.jpg)',
    });
  });

  it('does not render back arrow button', () => {
    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    expect(screen.queryByLabelText('Palaa takaisin')).not.toBeInTheDocument();
  });
});
