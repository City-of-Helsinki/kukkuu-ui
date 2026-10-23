import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import EventContent from '../EventContent';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/graphql';

describe('EventContent', () => {
  const baseEvent = {
    id: 'event-1',
    name: 'Teatteriesitys',
    description: 'Hieno esitys lapsille ja vanhemmille.',
    duration: 60,
    participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
  };

  it('renders event description and sidebar', () => {
    render(
      <EventContent
        event={baseEvent}
      />
    );

    expect(screen.getByText('Kuvaus')).toBeInTheDocument();
    expect(
      screen.getByText('Hieno esitys lapsille ja vanhemmille.')
    ).toBeInTheDocument();
  });

  it('renders venue info section when venue has description', () => {
    const venues = [
      {
        id: 'v-1',
        name: 'Kaapelitehdas',
        description: 'Kaapelitehdas on suuri kulttuurikeskus.',
      },
    ];

    render(
      <EventContent
        event={baseEvent}
        venues={venues}
      />
    );

    expect(screen.getByText('Tietoa tapahtumapaikasta')).toBeInTheDocument();
    expect(
      screen.getByText('Kaapelitehdas on suuri kulttuurikeskus.')
    ).toBeInTheDocument();
  });

  it('renders multiple venues with subheadings when multiple venues have descriptions', () => {
    const venues = [
      {
        id: 'v-1',
        name: 'Kaapelitehdas',
        description: 'Kaapelitehdas on suuri kulttuurikeskus.',
      },
      {
        id: 'v-2',
        name: 'Annantalo',
        description: 'Annantalo on lasten ja nuorten taidekeskus.',
      },
    ];

    render(
      <EventContent
        event={baseEvent}
        venues={venues}
      />
    );

    expect(screen.getByText('Tietoa tapahtumapaikasta')).toBeInTheDocument();
    expect(screen.getByText('Kaapelitehdas')).toBeInTheDocument();
    expect(
      screen.getByText('Kaapelitehdas on suuri kulttuurikeskus.')
    ).toBeInTheDocument();
    expect(screen.getByText('Annantalo')).toBeInTheDocument();
    expect(
      screen.getByText('Annantalo on lasten ja nuorten taidekeskus.')
    ).toBeInTheDocument();
  });

  it('does not render venue info section when venue description is missing or blank', () => {
    const venues = [
      {
        id: 'v-1',
        name: 'Kaapelitehdas',
        description: '',
      },
    ];

    render(
      <EventContent
        event={baseEvent}
        venues={venues}
      />
    );

    expect(
      screen.queryByText('Tietoa tapahtumapaikasta')
    ).not.toBeInTheDocument();
  });
});
