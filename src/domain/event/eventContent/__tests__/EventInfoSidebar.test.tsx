import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../../../api/generatedTypes/graphql';
import EventInfoSidebar from '../EventInfoSidebar';

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

  it('renders occurrence count, occurrences table button, duration, venues, participants, and languages', async () => {
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
    expect(screen.getByText('3 tapahtuma-aikaa')).toBeInTheDocument();
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
});
