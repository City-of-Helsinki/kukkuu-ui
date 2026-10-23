import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { customRender as render } from '../../../../../common/test/customRender';
import ProfileEnrolledEventCard from '../ProfileEnrolledEventCard';
import * as EventUtils from '../../../../event/EventUtils';

vi.mock('../../../../event/modal/UnenrolModal', () => ({
  default: ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) =>
    isOpen ? (
      <div data-testid="unenrol-modal">
        <button onClick={() => setIsOpen(false)}>Close unenrol modal</button>
      </div>
    ) : null,
}));

const mockInternalEnrolment = {
  __typename: 'EnrolmentNode' as const,
  id: 'enrolment-1',
  referenceId: 'ref-1',
  occurrence: {
    __typename: 'OccurrenceNode' as const,
    id: 'occ-1',
    time: '2026-09-12T10:00:00.000Z',
    venue: {
      __typename: 'VenueNode' as const,
      id: 'venue-1',
      name: 'Annantalo',
      address: 'Annankatu 30, Helsinki',
    },
    event: {
      __typename: 'EventNode' as const,
      id: 'event-1',
      name: 'Annantalon taidepaja',
      shortDescription: 'Oma muotokuva',
      duration: 120,
      image: 'https://example.com/image.png',
      imageAltText: 'Taidepaja',
      participantsPerInvite: 'FAMILY' as any,
    },
  },
};

const mockExternalEnrolment = {
  __typename: 'TicketmasterEnrolmentNode' as const,
  id: 'ticketmaster-1',
  event: {
    __typename: 'EventNode' as const,
    id: 'event-ext-1',
    name: 'Musiikkitalon konsertti',
    shortDescription: 'Upea konsertti',
    duration: 60,
    image: '',
    imageAltText: null,
    participantsPerInvite: 'FAMILY' as any,
  },
};

describe('ProfileEnrolledEventCard', () => {
  it('renders internal enrolled event details', () => {
    vi.spyOn(EventUtils, 'shouldAllowUnenrolment').mockReturnValue(true);

    render(
      <ProfileEnrolledEventCard
        childId="child-1"
        enrolment={mockInternalEnrolment}
      />
    );

    expect(screen.getByText('Annantalon taidepaja')).toBeInTheDocument();
    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();
    expect(screen.getByText('Oma muotokuva')).toBeInTheDocument();
    expect(screen.getByText(/Annankatu 30, Helsinki/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /lue lisää/i })
    ).toBeInTheDocument();
  });

  it('renders link to event details page for read more button', () => {
    render(
      <ProfileEnrolledEventCard
        childId="child-1"
        enrolment={mockInternalEnrolment}
      />
    );

    const readMoreLink = screen.getByRole('link', { name: /lue lisää/i });
    expect(readMoreLink).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-1'
    );
  });

  it('opens unenrol modal when cancel button is clicked', async () => {
    vi.spyOn(EventUtils, 'shouldAllowUnenrolment').mockReturnValue(true);
    const user = userEvent.setup();

    render(
      <ProfileEnrolledEventCard
        childId="child-1"
        enrolment={mockInternalEnrolment}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: /peruuta ilmoittautuminen tapahtumaan annantalon taidepaja/i,
    });
    expect(cancelButton).toBeEnabled();

    await user.click(cancelButton);
    expect(screen.getByTestId('unenrol-modal')).toBeInTheDocument();
  });

  it('disables cancel button and shows explanatory text when unenrolment is not allowed', () => {
    vi.spyOn(EventUtils, 'shouldAllowUnenrolment').mockReturnValue(false);

    render(
      <ProfileEnrolledEventCard
        childId="child-1"
        enrolment={mockInternalEnrolment}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: /peruuta ilmoittautuminen tapahtumaan annantalon taidepaja/i,
    });
    expect(cancelButton).toBeDisabled();
    expect(
      screen.getByText(/ilmoittautumista ei voi enää perua verkossa/i)
    ).toBeInTheDocument();
  });

  it('renders external ticket system enrolment correctly without occurrence', () => {
    render(
      <ProfileEnrolledEventCard
        childId="child-1"
        enrolment={mockExternalEnrolment}
      />
    );

    expect(screen.getByText('Musiikkitalon konsertti')).toBeInTheDocument();
    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();
    expect(screen.getByText('Upea konsertti')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /lue lisää/i })
    ).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-ext-1/external-enrolment'
    );
    // Cancellation is not available for external ticket systems
    expect(
      screen.queryByRole('button', { name: /peruuta/i })
    ).not.toBeInTheDocument();
  });
});
