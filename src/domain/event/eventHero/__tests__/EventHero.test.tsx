import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import { fakeProfile } from '../../../../utils/eventMockDataUtils';
import { EnrolmentDeniedReason } from '../../../api/generatedTypes/graphql';
import EventHero from '../EventHero';
import * as ProfileContextModule from '../../../profile/hooks/useProfileContext';

describe('EventHero', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
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
        allOccurrences={[baseOccurrence]}
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
    expect(screen.getByText(/Kieli:\s*Suomi/)).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 1')).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 2')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(
      <EventHero
        event={{
          ...baseEvent,
          image: 'https://example.com/sirkus.jpg',
          imageAltText: 'Sirkuskuva',
        }}
        allOccurrences={[baseOccurrence]}
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
        allOccurrences={[baseOccurrence]}
        childId="child-1"
      />
    );

    expect(screen.queryByLabelText('Palaa takaisin')).not.toBeInTheDocument();
  });

  it('renders anchor button jumping to occurrences table for multi-occurrence event', () => {
    const scrollIntoViewMock = vi.fn();
    const tableElement = document.createElement('div');
    tableElement.id = 'occurrences-table';
    tableElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(tableElement);

    render(
      <EventHero
        event={baseEvent}
        allOccurrences={[
          baseOccurrence,
          { ...baseOccurrence, id: 'occ-2', time: '2026-10-18T10:00:00Z' },
        ]}
        childId="child-1"
      />
    );

    expect(
      screen.getByText('4.10.2026 – 18.10.2026 (2 tapahtuma-aikaa)')
    ).toBeInTheDocument();
    const viewButton = screen.getByRole('link', {
      name: 'Katso tapahtuma-ajat ja ilmoittaudu',
    });
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(tableElement);
  });

  it('renders "Ilmoittautunut" badge, "Peruuta ilmoittautuminen" button, and view all link when enrolled in event', () => {
    vi.spyOn(ProfileContextModule, 'useProfileContext').mockReturnValue({
      profile: fakeProfile({
        id: 'profile-1',
        firstName: 'Maija',
        lastName: 'Meikäläinen',
        children: {
          edges: [
            {
              node: {
                id: 'child-1',
                name: 'Emma',
                enrolments: {
                  edges: [
                    {
                      node: {
                        id: 'enrolment-1',
                        occurrence: {
                          id: 'occ-1',
                          time: '2028-10-04T10:00:00Z',
                          event: { id: 'event-1', name: 'Sirkusseikkailu' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
      refetchProfile: vi.fn(),
      clearProfile: vi.fn(),
      updateProfile: vi.fn(),
      isLoading: false,
      isFetchCalled: true,
    } as any);

    render(
      <EventHero
        event={baseEvent}
        allOccurrences={[
          {
            ...baseOccurrence,
            time: '2028-10-04T10:00:00Z',
          },
        ]}
        childId="child-1"
      />
    );

    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {
      name: 'Peruuta ilmoittautuminen',
    });
    expect(cancelButton).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Katso kaikki ajankohdat' })
    ).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(
      screen.getByRole('dialog', { name: 'Peruuta ilmoittautuminen' })
    ).toBeInTheDocument();
  });

  it('renders "Lunasta salasana" button scrolling to #ticket-system-section for ticket system events', () => {
    const scrollIntoViewMock = vi.fn();
    const sectionElement = document.createElement('div');
    sectionElement.id = 'ticket-system-section';
    sectionElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(sectionElement);

    const ticketSystemEvent = {
      ...baseEvent,
      ticketSystem: {
        type: 'TICKETMASTER' as any,
        childPassword: null,
        url: 'https://ticketmaster.fi/event/123',
      },
    };

    render(
      <EventHero
        event={ticketSystemEvent}
        allOccurrences={[]}
        childId="child-1"
      />
    );

    const claimButton = screen.getByRole('link', {
      name: /lunasta salasana/i,
    });
    expect(claimButton).toBeInTheDocument();
    fireEvent.click(claimButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    expect(
      screen.queryByRole('button', { name: /peruuta ilmoittautuminen/i })
    ).not.toBeInTheDocument();

    document.body.removeChild(sectionElement);
  });

  it('renders "Ilmoittautunut" badge, "Katso salasana", and external link for enrolled ticket system event', () => {
    const scrollIntoViewMock = vi.fn();
    const sectionElement = document.createElement('div');
    sectionElement.id = 'ticket-system-section';
    sectionElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(sectionElement);

    const enrolledTicketSystemEvent = {
      ...baseEvent,
      ticketSystem: {
        type: 'LIPPUPISTE' as any,
        childPassword: 'SECRET-CODE-42',
        url: 'https://lippu.fi/event/123',
      },
    };

    render(
      <EventHero
        event={enrolledTicketSystemEvent}
        allOccurrences={[]}
        childId="child-1"
      />
    );

    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();
    const viewPasswordButton = screen.getByRole('button', {
      name: /katso salasana/i,
    });
    expect(viewPasswordButton).toBeInTheDocument();
    fireEvent.click(viewPasswordButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    const externalLink = screen.getByRole('link', {
      name: /jatka ulkoiseen lipunmyyntipalveluun/i,
    });
    expect(externalLink).toHaveAttribute('href', 'https://lippu.fi/event/123');
    expect(
      screen.queryByRole('button', { name: /peruuta ilmoittautuminen/i })
    ).not.toBeInTheDocument();

    document.body.removeChild(sectionElement);
  });

  it('renders "Kauden tapahtuma valittu" badge for sibling event in season group', () => {
    const siblingSeasonEvent = {
      ...baseEvent,
      id: 'sibling-event-2',
      enrolmentDeniedReason: EnrolmentDeniedReason.AlreadyJoinedEventGroup,
    };

    render(
      <EventHero
        event={siblingSeasonEvent}
        allOccurrences={[baseOccurrence]}
        childId="child-1"
      />
    );

    expect(screen.getByTestId('hero-season-enrolled-badge')).toHaveTextContent(
      'Kauden tapahtuma valittu'
    );
  });

  it('renders "Useita tapahtumapaikkoja" and "Kielet: Suomi, Ruotsi" when occurrences span multiple venues and languages', () => {
    const multiOccurrences = [
      baseOccurrence,
      {
        id: 'occ-2',
        time: '2026-10-10T12:00:00Z',
        occurrenceLanguage: 'SV',
        venue: {
          id: 'venue-2',
          name: 'Annantalo',
          address: 'Annankatu 30',
        },
      },
    ];

    render(
      <EventHero
        event={baseEvent}
        allOccurrences={multiOccurrences}
        childId="child-1"
      />
    );

    expect(screen.getByText('Useita tapahtumapaikkoja')).toBeInTheDocument();
    expect(screen.getByText(/Kielet:\s*Suomi,\s*Svenska/)).toBeInTheDocument();
  });
});
