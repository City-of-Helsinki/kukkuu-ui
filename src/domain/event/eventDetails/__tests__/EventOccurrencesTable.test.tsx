import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, act } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import i18n from '../../../../common/translation/i18n/i18nInit';
import EventOccurrencesTable, {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from '../EventOccurrencesTable';
import {
  EnrolmentDeniedReason,
  TicketSystem,
} from '../../../api/generatedTypes/graphql';

describe('EventOccurrencesTable', () => {
  const baseEvent: EventOccurrencesTableEvent = {
    id: 'event-1',
    name: 'Nukketeatteri Sampo: Pieni yösoitto',
    duration: 90,
    capacityPerOccurrence: 120,
    enrolmentDeniedReason: null,
    registrationOpensAt: null,
  };

  const baseOccurrences: EventOccurrencesTableOccurrence[] = [
    {
      id: 'occ-1',
      time: '2026-09-14T15:30:00Z', // 18:30 in Helsinki
      remainingCapacity: 66,
      venue: {
        id: 'venue-1',
        name: 'Pakilantie 12 B',
        address: 'Pakilantie 12 B',
      },
    },
    {
      id: 'occ-2',
      time: '2026-09-22T15:30:00Z',
      remainingCapacity: 0,
      childHasFreeSpotNotificationSubscription: false,
      venue: {
        id: 'venue-1',
        name: 'Pakilantie 12 B',
        address: 'Pakilantie 12 B',
      },
    },
    {
      id: 'occ-3',
      time: '2026-10-28T15:30:00Z',
      remainingCapacity: 0,
      childHasFreeSpotNotificationSubscription: true,
      venue: {
        id: 'venue-1',
        name: 'Pakilantie 12 B',
        address: 'Pakilantie 12 B',
      },
    },
  ];

  it('renders table headers, dates, times, and capacity ratios', () => {
    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    // Headers
    expect(screen.getByText('Päivämäärä')).toBeInTheDocument();
    expect(screen.getByText('Kellonaika')).toBeInTheDocument();
    expect(screen.getByText('Paikkoja jäljellä')).toBeInTheDocument();
    expect(screen.getByText('Toiminto')).toHaveClass('visually-hidden');

    // Occ-1: Available spots
    expect(screen.getByText('Ma 14.9.2026')).toBeInTheDocument();
    expect(screen.getAllByText('18:30–20:00')).toHaveLength(2);
    expect(screen.getByText('66/120')).toBeInTheDocument();

    const enrolButtons = screen.getAllByRole('button', {
      name: 'Ilmoittaudu',
    });
    expect(enrolButtons).toHaveLength(1);
  });

  it('renders "Tapahtuma täynnä" badge and notification buttons for full occurrences', () => {
    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    // Badges
    const fullBadges = screen.getAllByText('Tapahtuma täynnä');
    expect(fullBadges).toHaveLength(2);

    // Subscribe and unsubscribe buttons
    expect(
      screen.getByRole('button', { name: 'Tilaa ilmoitus' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Peruuta ilmoitus' })
    ).toBeInTheDocument();
  });

  it('calls onEnrol when enrol button is clicked', () => {
    const handleEnrol = vi.fn();
    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={handleEnrol}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const enrolButton = screen.getByRole('button', { name: 'Ilmoittaudu' });
    fireEvent.click(enrolButton);

    expect(handleEnrol).toHaveBeenCalledWith(baseOccurrences[0]);
  });

  it('calls onSubscribe and onUnsubscribe respectively', () => {
    const handleSubscribe = vi.fn();
    const handleUnsubscribe = vi.fn();

    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tilaa ilmoitus' }));
    expect(handleSubscribe).toHaveBeenCalledWith(baseOccurrences[1]);

    fireEvent.click(screen.getByRole('button', { name: 'Peruuta ilmoitus' }));
    expect(handleUnsubscribe).toHaveBeenCalledWith(baseOccurrences[2]);
  });

  it('renders disabled buttons when child cannot enroll', () => {
    render(
      <EventOccurrencesTable
        event={{
          ...baseEvent,
          enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
        }}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole('button', { name: 'Ilmoittaudu' });
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('renders disabled buttons when enrolmentDeniedReason is undefined', () => {
    render(
      <EventOccurrencesTable
        event={{
          ...baseEvent,
          enrolmentDeniedReason: undefined,
        }}
        occurrences={baseOccurrences}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole('button', { name: 'Ilmoittaudu' });
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('renders link for external ticket system occurrences', () => {
    const externalOccurrence: EventOccurrencesTableOccurrence = {
      id: 'occ-ext',
      time: '2026-10-15T12:00:00Z',
      remainingCapacity: 50,
      ticketSystem: {
        type: TicketSystem.Ticketmaster,
        url: 'https://ticketmaster.example/event',
      },
    };

    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={[externalOccurrence]}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const link = screen.getByRole('link', { name: 'Ilmoittaudu' });
    expect(link).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1/redirect'
    );
  });

  it('retains active locale prefix in external redirect URL for non-default languages', async () => {
    const externalOccurrence: EventOccurrencesTableOccurrence = {
      id: 'occ-ext',
      time: '2026-10-15T12:00:00Z',
      remainingCapacity: 50,
      ticketSystem: {
        type: TicketSystem.Ticketmaster,
        url: 'https://ticketmaster.example/event',
      },
    };

    await act(async () => {
      await i18n.changeLanguage('sv');
    });
    try {
      render(
        <EventOccurrencesTable
          event={baseEvent}
          occurrences={[externalOccurrence]}
          childId="child-1"
          onEnrol={vi.fn()}
          onSubscribe={vi.fn()}
          onUnsubscribe={vi.fn()}
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute(
        'href',
        '/sv/profile/child/child-1/event/event-1/redirect'
      );
    } finally {
      await act(async () => {
        await i18n.changeLanguage('fi');
      });
    }
  });

  it('renders link when ticket system is defined at event level', () => {
    const eventWithExternalTicketSystem: EventOccurrencesTableEvent = {
      ...baseEvent,
      ticketSystem: {
        type: TicketSystem.Lippupiste,
        url: 'https://lippu.fi/event',
      },
    };
    const occWithoutTicketSystem: EventOccurrencesTableOccurrence = {
      id: 'occ-no-ts',
      time: '2026-10-15T12:00:00Z',
      remainingCapacity: 50,
      ticketSystem: null,
    };

    render(
      <EventOccurrencesTable
        event={eventWithExternalTicketSystem}
        occurrences={[occWithoutTicketSystem]}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const link = screen.getByRole('link', { name: 'Ilmoittaudu' });
    expect(link).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1/redirect'
    );
  });

  it('falls back to remaining count when capacityPerOccurrence is undefined', () => {
    render(
      <EventOccurrencesTable
        event={{ ...baseEvent, capacityPerOccurrence: null }}
        occurrences={[baseOccurrences[0]]}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    expect(screen.getByText('66 paikkaa')).toBeInTheDocument();
  });

  it('renders empty message when occurrences array is empty', () => {
    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={[]}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    expect(
      screen.getByText('Ei tulevia tapahtuma-aikoja saatavilla.')
    ).toBeInTheDocument();
  });

  it('renders "Peruuta" for enrolled occurrence and disabled buttons for other occurrences', () => {
    const onCancel = vi.fn();
    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={baseOccurrences}
        childId="child-1"
        enrolledOccurrenceId="occ-1"
        onEnrol={vi.fn()}
        onCancelEnrolment={onCancel}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'occ-1' })
    );

    // Other rows should have disabled buttons
    const disabledButtons = screen.getAllByRole('button', {
      name: 'Ilmoittautunut toiseen aikaan',
    });
    expect(disabledButtons).toHaveLength(2);
    expect(disabledButtons[0]).toBeDisabled();
  });

  it('exposes EventOccurrencesTable.Row as a compound component', () => {
    expect(EventOccurrencesTable.Row).toBeDefined();

    render(
      <table>
        <tbody>
          <EventOccurrencesTable.Row
            occurrence={baseOccurrences[0]}
            event={baseEvent}
            childId="child-1"
            formatCapacityText={() => '66/120'}
            onEnrol={vi.fn()}
            onSubscribe={vi.fn()}
            onUnsubscribe={vi.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Ma 14.9.2026')).toBeInTheDocument();
  });

  it('synchronizes custom columns between headers and row cells', () => {
    const customColumns = [
      {
        id: 'date' as const,
        header: 'Custom Date Header',
      },
      {
        id: 'capacity' as const,
        header: 'Custom Spots Header',
      },
    ];

    render(
      <EventOccurrencesTable
        event={baseEvent}
        occurrences={[baseOccurrences[0]]}
        childId="child-1"
        columns={customColumns}
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    expect(screen.getByText('Custom Date Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Spots Header')).toBeInTheDocument();
    expect(screen.queryByText('Kellonaika')).not.toBeInTheDocument();
    expect(screen.queryByText('Toiminto')).not.toBeInTheDocument();

    const row = screen.getByTestId('occurrence-row-occ-1');
    const cells = row.querySelectorAll('td');
    expect(cells).toHaveLength(2);
  });
});
