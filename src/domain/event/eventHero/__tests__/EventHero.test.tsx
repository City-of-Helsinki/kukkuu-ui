import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import { fakeProfile } from '../../../../utils/eventMockDataUtils';
import EventHero from '../EventHero';
import * as ProfileContextModule from '../../../profile/hooks/useProfileContext';

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
    expect(screen.getByText(/Kielet:\s*Suomi/)).toBeInTheDocument();
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
});
