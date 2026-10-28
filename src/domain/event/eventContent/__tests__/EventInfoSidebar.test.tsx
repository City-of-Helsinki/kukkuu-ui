import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../../../api/generatedTypes/graphql';
import EventInfoSidebar, {
  EventSidebarOccurrence,
  EventSidebarOccurrencesInfo,
} from '../EventInfoSidebar';

describe('EventInfoSidebar', () => {
  const baseEvent = {
    id: 'event-1',
    duration: 60,
    participantsPerInvite: EventParticipantsPerInviteEnum.ChildAndGuardian,
  };

  const occurrences = [
    {
      id: 'occ-1',
      time: '2026-10-04T10:00:00Z',
      occurrenceLanguage: 'FI',
      venue: {
        id: 'venue-1',
        name: 'Oodi Lastenmaailma',
        address: 'Töölönlahdenkatu 4',
      },
    },
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

  it('renders date range with occurrence count, occurrences table button, duration, venues, participants, and languages', async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();
    const tableElement = document.createElement('div');
    tableElement.id = 'occurrences-table';
    tableElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(tableElement);

    render(
      <EventInfoSidebar
        event={baseEvent}
        occurrences={occurrences}
      />
    );

    // 1. Date and time / Occurrences summary
    expect(
      screen.getByText('4.10.2026 – 18.10.2026 (3 tapahtuma-aikaa)')
    ).toBeInTheDocument();
    const tableButton = screen.getByRole('button', {
      name: 'Katso tapahtuma-ajat ja ilmoittaudu',
    });
    expect(tableButton).toBeInTheDocument();
    await user.click(tableButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // 2. Duration
    expect(screen.getByText('Kesto')).toBeInTheDocument();
    expect(screen.getByText('1 h')).toBeInTheDocument();

    // 3. Location / Venues
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

    // 4. Participants per invite
    expect(screen.getByText('Osallistujat')).toBeInTheDocument();
    expect(screen.getByText('1 lapsi + 1 aikuinen')).toBeInTheDocument();

    // 5. Languages
    expect(screen.getByText('Kielet')).toBeInTheDocument();
    expect(screen.getByText(/Suomi/)).toBeInTheDocument();

    // Obsolete occurrence-level sections must NOT be rendered
    expect(screen.queryByText('Tapahtuma')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Siirry tapahtumasivulle' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Tapahtuman muut ajat')
    ).not.toBeInTheDocument();

    document.body.removeChild(tableElement);
  });

  it('renders ticket system provider and scroll action for ticket system event', async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();
    const sectionElement = document.createElement('div');
    sectionElement.id = 'ticket-system-section';
    sectionElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(sectionElement);

    render(
      <EventInfoSidebar
        event={{
          ...baseEvent,
          ticketSystem: {
            type: 'TICKETMASTER' as any,
            childPassword: null,
            url: 'https://ticketmaster.fi',
          },
        }}
        occurrences={[]}
      />
    );

    // Shows Ticketmaster provider
    expect(screen.getByText('Ticketmaster')).toBeInTheDocument();
    // Does NOT say 0 tapahtuma-aikaa
    expect(screen.queryByText(/0 tapahtuma-aikaa/i)).not.toBeInTheDocument();

    const claimButton = screen.getByRole('button', {
      name: 'Lunasta salasana',
    });
    expect(claimButton).toBeInTheDocument();
    await user.click(claimButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(sectionElement);
  });

  it('renders "Useita tapahtumapaikkoja" when occurrences span multiple venues', () => {
    const multiVenueOccurrences: EventSidebarOccurrence[] = [
      occurrences[0],
      {
        id: 'occ-diff-venue',
        time: '2026-10-10T12:00:00Z',
        occurrenceLanguage: 'FI',
        venue: {
          id: 'venue-annantalo',
          name: 'Annantalo',
          address: 'Annankatu 30',
        },
      },
    ];

    render(
      <EventInfoSidebar
        event={baseEvent}
        occurrences={multiVenueOccurrences}
      />
    );

    expect(screen.getByText('Useita tapahtumapaikkoja')).toBeInTheDocument();
  });

  it('renders single occurrence date and time when only one occurrence exists', () => {
    render(
      <EventInfoSidebar
        event={baseEvent}
        occurrences={[occurrences[0]]}
      />
    );

    expect(screen.getByText('Su 4.10.2026, 13:00–14:00')).toBeInTheDocument();
  });

  it('falls back to occurrences count when occurrences array is empty', () => {
    render(
      <EventInfoSidebar
        event={baseEvent}
        occurrences={[]}
      />
    );

    expect(screen.getByText('0 tapahtuma-aikaa')).toBeInTheDocument();
  });

  it('renders occurrences count when only occurrencesCount is provided to EventSidebarOccurrencesInfo', () => {
    render(
      <EventSidebarOccurrencesInfo occurrencesCount={5} />
    );

    expect(screen.getByText('5 tapahtuma-aikaa')).toBeInTheDocument();
  });
});
