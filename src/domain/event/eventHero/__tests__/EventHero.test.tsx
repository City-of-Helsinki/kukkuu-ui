import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import EventHero from '../EventHero';

const mockNavigate = vi.hoisted(() => vi.fn());
let mockLocationKey = 'test-key';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      key: mockLocationKey,
      pathname: '/profile/child/child-1/event/event-1',
    }),
  };
});

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

  it('renders enabled enrolment button when child can enroll and spots remain', () => {
    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const enrolLink = screen.getByRole('link', { name: 'Ilmoittaudu' });
    expect(enrolLink).toBeInTheDocument();
    expect(enrolLink).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1/occurrence/occ-1/enrol'
    );
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

  it('navigates -1 on back button click when history exists', async () => {
    mockLocationKey = 'history-key';
    mockNavigate.mockClear();

    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const backButton = screen.getByLabelText('Palaa takaisin');
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates to fallback search route when location.key is default (direct open)', async () => {
    mockLocationKey = 'default';
    mockNavigate.mockClear();

    render(
      <EventHero
        event={baseEvent}
        selectedOccurrence={baseOccurrence}
        childId="child-1"
      />
    );

    const backButton = screen.getByLabelText('Palaa takaisin');
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/profile/child/child-1/events'
    );
  });
});
