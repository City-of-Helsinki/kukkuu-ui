import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { GraphQLError } from 'graphql';

import { customRender as render } from '../../../../common/test/customRender';
import EnrolOccurrenceModal, {
  EnrolOccurrenceModalProps,
} from '../EnrolOccurrenceModal';
import eventQuery from '../../queries/eventQuery';
import enrolOccurrenceMutation from '../../mutations/enrolOccurrenceMutation';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/graphql';
import { GQLErrors } from '../../enrol/EnrolConstants';

const mockNavigate = vi.fn();
let mockPathname = '/';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: mockPathname,
      search: '',
      hash: '',
      state: null,
      key: 'test',
    }),
  };
});

vi.mock('../../api/client', () => ({ default: undefined }));
vi.mock('../../../api/client', () => ({ default: undefined }));

vi.mock('../../getEventOrEventGroupOccurrenceRefetchQueries', () => ({
  default: () => [],
}));

const mockProfile = {
  firstName: 'Matti',
  lastName: 'Meikäläinen',
  children: {
    edges: [
      {
        node: {
          id: 'child-123',
          name: 'Pikku Myy',
        },
      },
    ],
  },
};

const mockRefetchProfile = vi.fn().mockResolvedValue(undefined);

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: mockProfile,
    refetchProfile: mockRefetchProfile,
    clearProfile: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
    isFetchCalled: true,
  }),
}));

const defaultProps: EnrolOccurrenceModalProps = {
  isOpen: true,
  onClose: vi.fn(),
  childId: 'child-123',
  event: {
    id: 'event-1',
    name: 'Musiikkisatu',
    shortDescription: 'Hauska satuhetki',
    duration: 45,
    participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
    eventGroup: null,
  },
  occurrence: {
    id: 'occ-1',
    time: '2026-10-04T10:00:00Z',
    remainingCapacity: 8,
    occurrenceLanguage: 'FI',
    venue: {
      name: 'Annantalo',
      address: 'Annankatu 30',
    },
  },
};

describe('EnrolOccurrenceModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/';
  });

  it('renders modal details, participants, notices, and buttons when open', () => {
    render(<EnrolOccurrenceModal {...defaultProps} />, []);

    expect(
      screen.getByRole('dialog', { name: 'Vahvista ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(screen.getByText('Musiikkisatu')).toBeInTheDocument();
    expect(screen.getByText('Annantalo, Annankatu 30')).toBeInTheDocument();
    expect(screen.getByText('Su 4.10.2026')).toBeInTheDocument();
    expect(screen.getByText('klo 13:00–13:45')).toBeInTheDocument();

    expect(screen.getByText('Osallistujat')).toBeInTheDocument();
    expect(screen.getByText('Kulttuurilapsi')).toBeInTheDocument();
    expect(screen.getByText('Pikku Myy')).toBeInTheDocument();
    expect(screen.getByText('Lähiaikuinen')).toBeInTheDocument();
    expect(screen.getByText('Matti Meikäläinen')).toBeInTheDocument();

    expect(
      screen.getByText(/Huomioithan, että tilojen rajallisuuden ja osallistujamäärien vuoksi/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Kulttuurilapsi voi osallistua yhteen tapahtumaan kaudessa/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ilmoittautuminen on sitova/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Vahvista ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Peruuta' })
    ).toBeInTheDocument();
  });

  it('does not render dialog when isOpen is false', () => {
    render(<EnrolOccurrenceModal {...defaultProps} isOpen={false} />, []);

    expect(
      screen.queryByRole('dialog', { name: 'Vahvista ilmoittautuminen' })
    ).not.toBeInTheDocument();
  });

  it('calls onClose when clicking cancel button or close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, []);

    const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('executes enrolOccurrenceMutation when confirming, calls onClose, and navigates', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const mutationResult = vi.fn(() => ({
      data: {
        enrolOccurrence: {
          clientMutationId: null,
          enrolment: {
            id: 'enrolment-1',
            occurrence: {
              id: 'occ-1',
              event: { id: 'event-1' },
              venue: { id: 'venue-1' },
            },
            child: {
              id: 'child-123',
              occurrences: {
                edges: [],
              },
              pastEvents: {
                edges: [],
              },
              availableEvents: {
                edges: [],
              },
            },
          },
        },
      },
    }));

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: mutationResult,
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mutationResult).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByRole('heading', {
        name: 'Ilmoittautuminen onnistui',
      })
    ).toBeInTheDocument();

    const readyButton = screen.getByRole('button', {
      name: 'Valmis',
    });
    await user.click(readyButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/profile?child=child-123'
    );
  });

  it('does not navigate to profile when clicking ready button if already on profile page', async () => {
    mockPathname = '/profile';
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: {
          data: {
            enrolOccurrence: {
              clientMutationId: null,
              enrolment: {
                id: 'enrolment-1',
                occurrence: {
                  id: 'occ-1',
                  event: { id: 'event-1' },
                  venue: { id: 'venue-1' },
                },
                child: {
                  id: 'child-123',
                  occurrences: { edges: [] },
                  pastEvents: { edges: [] },
                  availableEvents: { edges: [] },
                },
              },
            },
          },
        },
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    const readyButton = await screen.findByRole('button', {
      name: 'Valmis',
    });
    await user.click(readyButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles child already joined error by closing modal and navigating with warning', async () => {
    const onClose = vi.fn();
    const toastWarningSpy = vi.spyOn(toast, 'warning');
    const user = userEvent.setup();

    const alreadyJoinedError = new GraphQLError(
      'Already joined',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: GQLErrors.CHILD_ALREADY_JOINED_EVENT_ERROR }
    );

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: {
          errors: [alreadyJoinedError],
        },
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/profile/child/child-123/event/event-1'
      );
      expect(toastWarningSpy).toHaveBeenCalled();
    });
  });

  it('handles occurrence full error by showing error toast', async () => {
    const onClose = vi.fn();
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const user = userEvent.setup();

    const occurrenceFullError = new GraphQLError(
      'Occurrence full',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: GQLErrors.OCCURRENCE_IS_FULL_ERROR }
    );

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: {
          errors: [occurrenceFullError],
        },
      },
      {
        request: {
          query: eventQuery,
          variables: {
            id: 'event-1',
            childId: 'child-123',
          },
        },
        result: {
          data: {
            event: null,
          },
        },
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });

  it('handles registration not open error by closing modal and showing warning toast', async () => {
    const onClose = vi.fn();
    const toastWarningSpy = vi.spyOn(toast, 'warning');
    const user = userEvent.setup();

    const notOpenError = new GraphQLError(
      'Registration not open',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: GQLErrors.REGISTRATION_NOT_OPEN_ERROR }
    );

    render(
      <EnrolOccurrenceModal
        {...defaultProps}
        event={{
          ...defaultProps.event,
          registrationOpensAt: '2099-06-01T07:00:00Z',
        }}
        onClose={onClose}
      />,
      [
        {
          request: {
            query: enrolOccurrenceMutation,
            variables: {
              input: {
                occurrenceId: 'occ-1',
                childId: 'child-123',
              },
            },
          },
          result: {
            errors: [notOpenError],
          },
        },
      ]
    );

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(toastWarningSpy).toHaveBeenCalledWith(
        'Ilmoittautuminen alkaa 1.6.2099 klo 10:00'
      );
    });
  });

  it('renders steppers for family event and increments participant counts', async () => {
    const user = userEvent.setup();
    const familyProps: EnrolOccurrenceModalProps = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        participantsPerInvite: EventParticipantsPerInvite.Family,
      },
      occurrence: {
        ...defaultProps.occurrence,
        remainingCapacity: 10,
      },
    };

    render(<EnrolOccurrenceModal {...familyProps} />, []);

    expect(screen.getByText('Osallistujat')).toBeInTheDocument();
    const childSpin = screen.getByRole('spinbutton', {
      name: 'Lisälapsien määrä',
    });
    const adultSpin = screen.getByRole('spinbutton', {
      name: 'Lisäaikuisten määrä',
    });
    expect(childSpin).toHaveValue(0);
    expect(adultSpin).toHaveValue(0);

    // Click plus button on extra children
    const plusChildBtn = screen.getByRole('button', {
      name: 'Lisää muita lapsia',
    });
    await user.click(plusChildBtn);
    expect(childSpin).toHaveValue(1);

    // Click plus button on extra adults
    const plusAdultBtn = screen.getByRole('button', {
      name: 'Lisää muita aikuisia',
    });
    await user.click(plusAdultBtn);
    expect(adultSpin).toHaveValue(1);
  });

  it('submits family extra participant counts in mutation variables', async () => {
    const user = userEvent.setup();
    const mutationResult = vi.fn(() => ({
      data: {
        enrolOccurrence: {
          clientMutationId: null,
          enrolment: {
            id: 'enrolment-fam-1',
            extraChildrenCount: 1,
            extraGuardiansCount: 1,
            totalSeats: 4,
            occurrence: {
              id: 'occ-1',
              event: { id: 'event-1' },
              venue: { id: 'venue-1' },
            },
            child: {
              id: 'child-123',
              occurrences: { edges: [] },
              pastEvents: { edges: [] },
              availableEvents: { edges: [] },
            },
          },
        },
      },
    }));

    const familyProps: EnrolOccurrenceModalProps = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        participantsPerInvite: EventParticipantsPerInvite.Family,
      },
      occurrence: {
        ...defaultProps.occurrence,
        remainingCapacity: 10,
      },
    };

    render(<EnrolOccurrenceModal {...familyProps} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
              extraChildrenCount: 1,
              extraGuardiansCount: 1,
            },
          },
        },
        result: mutationResult,
      },
    ]);

    // Increase children to 1
    await user.click(
      screen.getByRole('button', { name: 'Lisää muita lapsia' })
    );
    // Increase adults to 1
    await user.click(
      screen.getByRole('button', { name: 'Lisää muita aikuisia' })
    );

    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const submitBtn = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mutationResult).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByRole('heading', {
        name: 'Ilmoittautuminen onnistui',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Ilmoittautunut: Pikku Myy')).toBeInTheDocument();
    expect(screen.getByText('Pikku Myy + 1 lisälapsi')).toBeInTheDocument();
    expect(screen.getByText('Matti Meikäläinen + 1 lisäaikuinen')).toBeInTheDocument();
    expect(toastSuccessSpy).toHaveBeenCalled();

    const readyBtn = screen.getByRole('button', {
      name: 'Valmis',
    });
    await user.click(readyBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/profile?child=child-123');
  });

  it('caps extra participants to remaining occurrence capacity', async () => {
    const user = userEvent.setup();
    // Capacity is 3, baseline takes 2, so only 1 extra seat is available
    const limitedCapacityProps: EnrolOccurrenceModalProps = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        participantsPerInvite: EventParticipantsPerInvite.Family,
      },
      occurrence: {
        ...defaultProps.occurrence,
        remainingCapacity: 3,
      },
    };

    render(<EnrolOccurrenceModal {...limitedCapacityProps} />, []);

    const plusChildBtn = screen.getByRole('button', {
      name: 'Lisää muita lapsia',
    });
    await user.click(plusChildBtn);

    const childSpin = screen.getByRole('spinbutton', {
      name: 'Lisälapsien määrä',
    });
    expect(childSpin).toHaveValue(1);

    // Adult plus button should be disabled because remaining capacity is exhausted
    const plusAdultBtn = screen.getByRole('button', {
      name: 'Lisää muita aikuisia',
    });
    expect(plusAdultBtn).toBeDisabled();
  });
});
