import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import { EventOccurrenceActionButton } from '../EventOccurrenceActionButton';
import { TicketSystem } from '../../../api/generatedTypes/graphql';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from '../EventOccurrencesTable';

describe('EventOccurrenceActionButton', () => {
  const baseEvent: EventOccurrencesTableEvent = {
    id: 'event-1',
    name: 'Konsertti',
    duration: 60,
    enrolmentDeniedReason: null,
  };

  const availableOcc: EventOccurrencesTableOccurrence = {
    id: 'occ-1',
    time: '2026-09-14T15:30:00Z',
    remainingCapacity: 10,
  };

  const fullOcc: EventOccurrencesTableOccurrence = {
    id: 'occ-2',
    time: '2026-09-14T15:30:00Z',
    remainingCapacity: 0,
    childHasFreeSpotNotificationSubscription: false,
  };

  const subscribedOcc: EventOccurrencesTableOccurrence = {
    id: 'occ-3',
    time: '2026-09-14T15:30:00Z',
    remainingCapacity: 0,
    childHasFreeSpotNotificationSubscription: true,
  };

  it('renders primary enrol button when spots are available and calls onEnrol', async () => {
    const user = userEvent.setup();
    const handleEnrol = vi.fn();
    render(
      <EventOccurrenceActionButton
        occurrence={availableOcc}
        event={baseEvent}
        childId="child-1"
        onEnrol={handleEnrol}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const btn = screen.getByRole('button', { name: 'Ilmoittaudu' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(handleEnrol).toHaveBeenCalledWith(availableOcc);
  });

  it('renders show enrolment button when enrolled in this occurrence', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(
      <EventOccurrenceActionButton
        occurrence={availableOcc}
        event={baseEvent}
        childId="child-1"
        enrolledOccurrenceId="occ-1"
        onEnrol={vi.fn()}
        onCancelEnrolment={handleCancel}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const btn = screen.getByRole('button', { name: 'Katso tiedot' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(handleCancel).toHaveBeenCalledWith(availableOcc);
  });

  it('renders disabled button when already enrolled in another occurrence', () => {
    render(
      <EventOccurrenceActionButton
        occurrence={availableOcc}
        event={baseEvent}
        childId="child-1"
        enrolledOccurrenceId="occ-other"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    const btn = screen.getByRole('button', {
      name: 'Ilmoittautunut toiseen aikaan',
    });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-label', 'Ilmoittautunut toiseen aikaan');
  });

  it('renders subscribe button when occurrence is full and not subscribed', async () => {
    const user = userEvent.setup();
    const handleSubscribe = vi.fn();
    render(
      <EventOccurrenceActionButton
        occurrence={fullOcc}
        event={baseEvent}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={handleSubscribe}
        onUnsubscribe={vi.fn()}
      />
    );

    const btn = screen.getByRole('button', { name: 'Tilaa ilmoitus' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(handleSubscribe).toHaveBeenCalledWith(fullOcc);
  });

  it('renders unsubscribe button when occurrence is full and subscribed', async () => {
    const user = userEvent.setup();
    const handleUnsubscribe = vi.fn();
    render(
      <EventOccurrenceActionButton
        occurrence={subscribedOcc}
        event={baseEvent}
        childId="child-1"
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={handleUnsubscribe}
      />
    );

    const btn = screen.getByRole('button', { name: 'Peruuta ilmoitus' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(handleUnsubscribe).toHaveBeenCalledWith(subscribedOcc);
  });

  it('renders redirect link for external ticket system', () => {
    const externalOcc: EventOccurrencesTableOccurrence = {
      ...availableOcc,
      ticketSystem: {
        type: TicketSystem.Ticketmaster,
        url: 'https://ticketmaster.fi',
      },
    };

    render(
      <EventOccurrenceActionButton
        occurrence={externalOcc}
        event={baseEvent}
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

  it('exposes button subcomponents as compound components', () => {
    expect(EventOccurrenceActionButton.Cancel).toBeDefined();
    expect(EventOccurrenceActionButton.ShowEnrolment).toBeDefined();
    expect(EventOccurrenceActionButton.AlreadyEnrolledOther).toBeDefined();
    expect(EventOccurrenceActionButton.CannotEnrol).toBeDefined();
    expect(EventOccurrenceActionButton.External).toBeDefined();
    expect(EventOccurrenceActionButton.Enrol).toBeDefined();
    expect(EventOccurrenceActionButton.Unsubscribe).toBeDefined();
    expect(EventOccurrenceActionButton.Subscribe).toBeDefined();
  });

  it('renders individual subcomponents directly', async () => {
    const user = userEvent.setup();
    const handleEnrol = vi.fn();
    render(<EventOccurrenceActionButton.Enrol onEnrol={handleEnrol} />);
    const enrolBtn = screen.getByRole('button', { name: 'Ilmoittaudu' });
    await user.click(enrolBtn);
    expect(handleEnrol).toHaveBeenCalled();
  });
});
