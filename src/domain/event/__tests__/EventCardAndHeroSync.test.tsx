import { describe, expect, it } from 'vitest';
import { within } from '@testing-library/react';

import { customRender as render } from '../../../common/test/customRender';
import {
  fakeAvailableVenue,
  fakeOccurrenceAccessibility,
  fakeOccurrenceLanguage,
} from '../../../utils/eventMockDataUtils';
import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite,
} from '../../api/generatedTypes/graphql';
import EventSearchCard from '../search/EventSearchCard';
import EventHero from '../eventHero/EventHero';
import type { AvailableEvent } from '../types/EventsSearchTypes';

describe('EventSearchCard and EventHero synchronization', () => {
  const sharedOccurrences = [
    {
      id: 'occ-1',
      time: '2026-10-04T10:00:00Z',
      remainingCapacity: 0,
      languages: [
        fakeOccurrenceLanguage({ alpha3Code: 'fin', name: 'suomi' }),
        fakeOccurrenceLanguage({ alpha3Code: 'zxx', name: 'Sanaton' }),
      ],
      accessibilities: [
        fakeOccurrenceAccessibility({
          id: 'acc-1',
          slug: 'sensory_sensitivity',
          name: 'Aistiherkkyys',
          sortOrder: 1,
        }),
        fakeOccurrenceAccessibility({
          id: 'acc-2',
          slug: 'hearing',
          name: 'Kuulemisen tuki',
          sortOrder: 4,
        }),
      ],
      venue: fakeAvailableVenue({
        id: 'venue-1',
        name: 'Annantalo',
        address: 'Annankatu 30',
      }),
    },
    {
      id: 'occ-2',
      time: '2026-10-18T12:00:00Z',
      remainingCapacity: 1,
      languages: [fakeOccurrenceLanguage({ alpha3Code: 'swe', name: 'ruotsi' })],
      accessibilities: [
        fakeOccurrenceAccessibility({
          id: 'acc-1',
          slug: 'sensory_sensitivity',
          name: 'Aistiherkkyys',
          sortOrder: 1,
        }),
      ],
      venue: fakeAvailableVenue({
        id: 'venue-2',
        name: 'Kaapelitehdas',
        address: 'Kaapeliaukio 3',
      }),
    },
  ];

  const sharedEvent: AvailableEvent = {
    id: 'event-sync-1',
    name: 'Nukketeatteri Sampo: Pieni yösoitto',
    shortDescription: 'Visuaalinen ja musiikillinen elämys.\nToinen rivi kuvausta.',
    image: 'https://example.com/sampo.jpg',
    imageAltText: 'Kuutamo meren yllä',
    duration: 60,
    participantsPerInvite: EventParticipantsPerInvite.Family,
    enrolmentDeniedReason: EnrolmentDeniedReason.AlreadyJoinedEventGroup,
    registrationOpensAt: null,
    themePaths: [{ id: 'tp-tarina', slug: 'tarina', name: 'Tarina' }],
    occurrences: {
      edges: sharedOccurrences.map((node) => ({ node })),
    },
  };

  it('renders identical title, multi-line short description, date range, multiple venues text, languages, and synchronized badges in both Card and Hero', () => {
    const { container: cardContainer } = render(
      <EventSearchCard childId="child-1" event={sharedEvent} />
    );
    const { container: heroContainer } = render(
      <EventHero
        childId="child-1"
        event={sharedEvent}
        allOccurrences={sharedOccurrences}
      />
    );

    const cardScope = within(cardContainer);
    const heroScope = within(heroContainer);

    // 1. Title
    expect(
      cardScope.getByRole('heading', {
        name: 'Nukketeatteri Sampo: Pieni yösoitto',
      })
    ).toBeInTheDocument();
    expect(
      heroScope.getByRole('heading', {
        name: 'Nukketeatteri Sampo: Pieni yösoitto',
      })
    ).toBeInTheDocument();

    // 2. Short description with line break support
    const expectedShortDescription =
      'Visuaalinen ja musiikillinen elämys.\nToinen rivi kuvausta.';
    expect(
      cardScope.getByText(expectedShortDescription, {
        normalizer: (str) => str,
      })
    ).toBeInTheDocument();
    expect(
      heroScope.getByText(expectedShortDescription, {
        normalizer: (str) => str,
      })
    ).toBeInTheDocument();

    // 3. Date range and occurrence count
    const expectedDateText = '4.10.2026 – 18.10.2026 (2 tapahtuma-aikaa)';
    expect(cardScope.getByText(expectedDateText)).toBeInTheDocument();
    expect(heroScope.getByText(expectedDateText)).toBeInTheDocument();

    // 4. Venue detail (multiple venues)
    const expectedVenueText = 'Useita tapahtumapaikkoja';
    expect(cardScope.getByText(expectedVenueText)).toBeInTheDocument();
    expect(heroScope.getByText(expectedVenueText)).toBeInTheDocument();

    // 5. Languages collected from all occurrences (including zxx -> Sanaton)
    const expectedLanguageText = 'Kielet: Suomi, Sanaton, Svenska';
    expect(cardScope.getByText(expectedLanguageText)).toBeInTheDocument();
    expect(heroScope.getByText(expectedLanguageText)).toBeInTheDocument();

    // 6. Badges / labels (Full, Theme path, Family event, Accessibilities, Speechless)
    expect(cardScope.getByTestId('event-badge-full')).toHaveTextContent(
      'Täynnä'
    );
    expect(heroScope.getByTestId('event-badge-full')).toHaveTextContent(
      'Täynnä'
    );

    expect(
      cardScope.getByTestId('event-badge-theme-path-tarina')
    ).toHaveTextContent('Teemapolku: Tarina');
    expect(
      heroScope.getByTestId('event-badge-theme-path-tarina')
    ).toHaveTextContent('Teemapolku: Tarina');

    expect(cardScope.getByTestId('event-badge-family')).toHaveTextContent(
      'Perhetapahtuma'
    );
    expect(heroScope.getByTestId('event-badge-family')).toHaveTextContent(
      'Perhetapahtuma'
    );

    // Accessibility & speechless badges: Card shows label without count, Hero shows label with count
    expect(
      cardScope.getByTestId('event-badge-accessibility-sensory_sensitivity')
    ).toHaveTextContent('Aistiherkkyys');
    expect(
      heroScope.getByTestId('event-badge-accessibility-sensory_sensitivity')
    ).toHaveTextContent('Aistiherkkyys (2)');

    expect(
      cardScope.getByTestId('event-badge-accessibility-hearing')
    ).toHaveTextContent('Kuulemisen tuki');
    expect(
      cardScope
        .getByTestId('event-badge-accessibility-hearing')
        .querySelector('svg[aria-label="universal-access"]')
    ).toBeInTheDocument();
    expect(
      heroScope.getByTestId('event-badge-accessibility-hearing')
    ).toHaveTextContent('Kuulemisen tuki (1)');
    expect(
      heroScope
        .getByTestId('event-badge-accessibility-hearing')
        .querySelector('svg[aria-label="universal-access"]')
    ).toBeInTheDocument();

    const cardSpeechlessBadge = cardScope.getByTestId('event-badge-speechless');
    const heroSpeechlessBadge = heroScope.getByTestId('event-badge-speechless');
    expect(cardSpeechlessBadge).toHaveTextContent('Sanaton');
    expect(
      cardSpeechlessBadge.querySelector('svg[aria-label="speechless"]')
    ).toBeInTheDocument();
    expect(heroSpeechlessBadge).toHaveTextContent('Sanaton (1)');
    expect(
      heroSpeechlessBadge.querySelector('svg[aria-label="speechless"]')
    ).toBeInTheDocument();
  });

  it('renders identical single-occurrence date/time, single-venue address, and single-language text in both Card and Hero', () => {
    const singleOccurrence = [
      {
        id: 'occ-single',
        time: '2026-10-04T10:00:00Z',
        remainingCapacity: 10,
        languages: [fakeOccurrenceLanguage({ alpha3Code: 'fin', name: 'suomi' })],
        venue: fakeAvailableVenue({
          id: 'venue-1',
          name: 'Annantalo',
          address: 'Annankatu 30',
        }),
      },
    ];

    const singleEvent: AvailableEvent = {
      ...sharedEvent,
      enrolmentDeniedReason: null,
      occurrences: {
        edges: singleOccurrence.map((node) => ({ node })),
      },
    };

    const { container: cardContainer } = render(
      <EventSearchCard childId="child-1" event={singleEvent} />
    );
    const { container: heroContainer } = render(
      <EventHero
        childId="child-1"
        event={singleEvent}
        allOccurrences={singleOccurrence}
      />
    );

    const cardScope = within(cardContainer);
    const heroScope = within(heroContainer);

    const expectedSingleDate = 'Su 4.10.2026 klo 13:00–14:00';
    expect(cardScope.getByText(expectedSingleDate)).toBeInTheDocument();
    expect(heroScope.getByText(expectedSingleDate)).toBeInTheDocument();

    const expectedSingleVenue = 'Annantalo, Annankatu 30';
    expect(cardScope.getByText(expectedSingleVenue)).toBeInTheDocument();
    expect(heroScope.getByText(expectedSingleVenue)).toBeInTheDocument();

    const expectedSingleLanguage = 'Kieli: Suomi';
    expect(cardScope.getByText(expectedSingleLanguage)).toBeInTheDocument();
    expect(heroScope.getByText(expectedSingleLanguage)).toBeInTheDocument();
  });
});
