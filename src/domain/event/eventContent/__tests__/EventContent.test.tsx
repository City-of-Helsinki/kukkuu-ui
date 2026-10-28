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

  it('renders children passed into the main column', () => {
    render(
      <EventContent event={baseEvent}>
        <div data-testid="custom-child">Child Content</div>
      </EventContent>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
