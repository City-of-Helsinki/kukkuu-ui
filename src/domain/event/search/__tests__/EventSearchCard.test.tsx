import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import i18n from '../../../../common/translation/i18n/i18nInit';
import EventSearchCard from '../EventSearchCard';
import type { AvailableEvent } from '../../types/ChildAvailableOccurrencesTypes';
import { EnrolmentDeniedReason, Language, TicketSystem } from '../../../api/generatedTypes/graphql';

describe('EventSearchCard', () => {
  const baseEvent: AvailableEvent = {
    id: 'event-123',
    name: 'Musiikkiseikkailu',
    shortDescription: 'Ihanaa musiikkia koko perheelle',
    image: null,
    imageAltText: null,
    duration: 60,
    enrolmentDeniedReason: null,
    registrationOpensAt: null,
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

  it('renders registration opening notice when registration is not open and registrationOpensAt is in future', () => {
    const registrationNotOpenEvent: AvailableEvent = {
      ...baseEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
      registrationOpensAt: '2099-06-01T07:00:00Z',
    };

    render(<EventSearchCard childId="child-1" event={registrationNotOpenEvent} />);

    expect(
      screen.getByText('Ilmoittautuminen alkaa 1.6.2099 klo 10:00')
    ).toBeInTheDocument();
  });

  it('renders generic not-opened-yet notice when registration is not open without opening time', () => {
    const registrationNotOpenEvent: AvailableEvent = {
      ...baseEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
      registrationOpensAt: null,
    };

    render(<EventSearchCard childId="child-1" event={registrationNotOpenEvent} />);

    expect(
      screen.getByText('Ilmoittautuminen ei ole vielä alkanut')
    ).toBeInTheDocument();
  });

  it('retains active locale prefix in detailsUrl for non-default languages', async () => {
    await i18n.changeLanguage('sv');
    try {
      render(<EventSearchCard childId="child-1" event={baseEvent} />);

      const actionLink = screen.getByRole('link');
      expect(actionLink).toHaveAttribute(
        'href',
        '/sv/profile/child/child-1/event/event-123'
      );
    } finally {
      await i18n.changeLanguage('fi');
    }
  });

  it('renders provider badge for external ticket system event with no occurrences', () => {
    const ticketSystemEvent: AvailableEvent = {
      ...baseEvent,
      ticketSystem: {
        type: TicketSystem.Ticketmaster,
      },
      occurrences: {
        edges: [],
      },
    };

    render(<EventSearchCard childId="child-1" event={ticketSystemEvent} />);

    expect(screen.getByTestId('ticket-system-badge')).toHaveTextContent('Ticketmaster');
    expect(screen.getByText('Musiikkiseikkailu')).toBeInTheDocument();
  });

  it('renders enrolled badge and notice when child is already enrolled in this event', () => {
    const enrolledEvent: AvailableEvent = {
      ...baseEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.AlreadyJoinedEvent,
    };

    render(<EventSearchCard childId="child-1" event={enrolledEvent} />);

    expect(screen.getByTestId('enrolled-badge')).toHaveTextContent('Ilmoittautunut');
    expect(screen.getByTestId('already-enrolled-notice')).toHaveTextContent(
      'Olet jo ilmoittautunut tähän tapahtumaan.'
    );
    expect(screen.getByRole('link', { name: 'Lue lisää' })).toBeInTheDocument();
  });

  it('renders season enrolled badge and notice when child is enrolled in a sibling event of the season', () => {
    const siblingEvent: AvailableEvent = {
      ...baseEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.AlreadyJoinedEventGroup,
    };

    render(<EventSearchCard childId="child-1" event={siblingEvent} />);

    expect(screen.getByTestId('season-enrolled-badge')).toHaveTextContent(
      'Kauden tapahtuma valittu'
    );
    expect(screen.getByTestId('already-enrolled-season-notice')).toHaveTextContent(
      'Olet jo ilmoittautunut toiseen tämän kauden tapahtumaan.'
    );
    expect(screen.getByRole('link', { name: 'Lue lisää' })).toBeInTheDocument();
  });

  it('renders yearly limit reached notice when child reached yearly limit', () => {
    const limitReachedEvent: AvailableEvent = {
      ...baseEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.YearlyEnrolmentLimitReached,
    };

    render(<EventSearchCard childId="child-1" event={limitReachedEvent} />);

    expect(screen.getByTestId('yearly-limit-reached-notice')).toHaveTextContent(
      'Vuosittainen ilmoittautumiskiintiö on täynnä.'
    );
    expect(screen.getByRole('link', { name: 'Lue lisää' })).toBeInTheDocument();
  });

  it('renders enrolled badge and notice for external ticket system event with childPassword even if backend returns YearlyEnrolmentLimitReached', () => {
    const enrolledTicketmasterEvent: AvailableEvent = {
      ...baseEvent,
      ticketSystem: {
        type: TicketSystem.Ticketmaster,
        childPassword: 'SECRET-CODE-123',
      },
      enrolmentDeniedReason: EnrolmentDeniedReason.YearlyEnrolmentLimitReached,
    };

    render(
      <EventSearchCard childId="child-1" event={enrolledTicketmasterEvent} />
    );

    expect(screen.getByTestId('enrolled-badge')).toHaveTextContent(
      'Ilmoittautunut'
    );
    expect(screen.getByTestId('already-enrolled-notice')).toHaveTextContent(
      'Olet jo ilmoittautunut tähän tapahtumaan.'
    );
    expect(
      screen.queryByTestId('yearly-limit-reached-notice')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lue lisää' })).toBeInTheDocument();
  });
});
