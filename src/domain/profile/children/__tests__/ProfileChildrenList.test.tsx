import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedResponse } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import { customRender as render } from '../../../../common/test/customRender';
import ProfileChildrenList from '../ProfileChildrenList';
import * as ProfileContextModule from '../../hooks/useProfileContext';
import * as NotEligibleUtils from '../../../registration/notEligible/NotEligibleUtils';
import { addChildMutation } from '../../../child/mutation/ChildMutation';
import {
  ProfileQueryDocument,
  RelationshipTypeEnum,
} from '../../../api/generatedTypes/graphql';
import { childEventInvitationLabelQuery } from '../../../child/queries/ChildEventInvitationLabelQuery';
import { childEnrolmentCountQuery } from '../../../child/queries/ChildEnrolmentCountQuery';
import { store } from '../../../app/state/AppStore';
import {
  setFormValues,
  resetFormValues,
} from '../../../registration/state/RegistrationActions';
import type { MyProfile } from '../../types/ProfileQueryTypes';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@sentry/browser', () => ({ captureException: vi.fn() }));

// Component passes client: graphqlClient to useMutation — override so
// MockedProvider's context client is used instead.
vi.mock('../../../api/client', () => ({ default: undefined }));

vi.mock('../../ProfileProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const mockTrackEvent = vi.hoisted(() => vi.fn());
vi.mock('@jonkoops/matomo-tracker-react', () => ({
  useMatomo: () => ({ trackEvent: mockTrackEvent }),
}));

const mockRefetchProfile = vi.fn();

const prefillStore = () => {
  store.dispatch(
    setFormValues({
      ...store.getState().registration.formValues,
      children: [
        {
          birthyear: 2022,
          name: 'Testi Lapsi',
          homeCity: 'Helsinki',
          postalCode: '00100',
          relationship: { type: RelationshipTypeEnum.Parent },
        },
      ],
    })
  );
};

const baseProfile: MyProfile = {
  id: 'guardian-1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNumber: '0501234567',
  language: 'fi' as any,
  hasAcceptedCommunication: true,
  // edges: undefined is falsy → component shows "Ei kummilapsia" text
  children: { edges: undefined as any, __typename: 'ChildNodeConnection' },
  languagesSpokenAtHome: { edges: [], __typename: 'LanguageNodeConnection' },
};

const childProfile: MyProfile = {
  ...baseProfile,
  children: {
    __typename: 'ChildNodeConnection',
    edges: [
      {
        __typename: 'ChildNodeEdge',
        node: {
          __typename: 'ChildNode',
          id: 'child-1',
          name: 'Testi Lapsi',
          birthyear: 2020,
          postalCode: '00100',
          project: { __typename: 'ProjectNode', id: 'proj-1', name: 'Testiorganisaatio', year: 2020 },
          upcomingEventsAndEventGroups: { __typename: 'EventOrEventGroupConnection', edges: [] },
          occurrences: { __typename: 'OccurrenceNodeConnection', edges: [] },
          enrolments: { __typename: 'EnrolmentNodeConnection', edges: [] },
          relationships: { __typename: 'RelationshipNodeConnection', edges: [] },
        },
      },
    ],
  },
};

function mockProfile(profile: MyProfile | null) {
  vi.spyOn(ProfileContextModule, 'useProfileContext').mockReturnValue({
    profile,
    refetchProfile: mockRefetchProfile,
    clearProfile: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
    isFetchCalled: true,
  });
}

const getAddChildButton = () =>
  screen.getByRole('button', { name: 'Lisää lapsi' });

const childInvitationLabelMock: MockedResponse = {
  request: {
    query: childEventInvitationLabelQuery,
    variables: {
      childId: 'child-1',
    },
  },
  result: {
    data: {
      child: {
        __typename: 'ChildNode',
        id: 'child-1',
        upcomingEventsAndEventGroups: {
          __typename: 'EventOrEventGroupConnection',
          edges: [
            {
              __typename: 'EventOrEventGroupEdge',
              node: {
                __typename: 'EventNode',
                id: 'event-1',
                canChildEnroll: true,
              },
            },
          ],
        },
      },
    },
  },
};

const childEnrolmentCountMock: MockedResponse = {
  request: {
    query: childEnrolmentCountQuery,
    variables: {
      childId: 'child-1',
    },
  },
  result: {
    data: {
      child: {
        __typename: 'ChildNode',
        id: 'child-1',
        enrolmentCount: 0,
        pastEnrolmentCount: 0,
        project: {
          __typename: 'ProjectNode',
          id: 'proj-1',
          enrolmentLimit: 2,
        },
      },
    },
  },
};

const profileRefetchMock: MockedResponse = {
  request: {
    query: ProfileQueryDocument,
    variables: {},
  },
  newData: () => ({
    data: {
      myProfile: null,
    },
  }),
};

describe('ProfileChildrenList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    store.dispatch(resetFormValues());
  });

  describe('rendering', () => {
    it('renders the heading and add child button', () => {
      mockProfile(baseProfile);
      render(<ProfileChildrenList />, []);

      expect(
        screen.getByRole('heading', { name: 'Kummilapset' })
      ).toBeInTheDocument();
      expect(getAddChildButton()).toBeInTheDocument();
    });

    it('renders the no-children message when there are no children', () => {
      mockProfile(baseProfile);
      render(<ProfileChildrenList />, []);

      expect(screen.getByText('Ei kummilapsia')).toBeInTheDocument();
    });

    it('renders a child card when profile has children', () => {
      mockProfile(childProfile);
      render(<ProfileChildrenList />, [
        childInvitationLabelMock,
        childEnrolmentCountMock,
      ]);

      expect(screen.getByText('Testi Lapsi')).toBeInTheDocument();
    });

    it('renders the project year heading when there are children', () => {
      mockProfile(childProfile);
      render(<ProfileChildrenList />, [
        childInvitationLabelMock,
        childEnrolmentCountMock,
      ]);

      // The project year should appear in the project description heading
      expect(screen.getByText(/2020/)).toBeInTheDocument();
    });
  });

  describe('add child modal', () => {
    it('opens AddNewChildFormModal when the add child button is clicked', async () => {
      mockProfile(baseProfile);
      const user = userEvent.setup();
      render(<ProfileChildrenList />, []);

      await user.click(getAddChildButton());

      expect(
        await screen.findByRole('heading', { name: 'Lisää lapsi' })
      ).toBeInTheDocument();
    });

    it('calls addChild mutation and trackEvent on successful child submission', async () => {
      mockProfile(baseProfile);
      vi.spyOn(NotEligibleUtils, 'isChildEligible').mockReturnValue(true);
      prefillStore();

      // getSupportedChildData strips homeCity, so variables won't have it
      const addChildMock: MockedResponse = {
        request: {
          query: addChildMutation,
          variables: {
            input: {
              name: 'Testi Lapsi',
              birthyear: 2022,
              postalCode: '00100',
              relationship: { type: RelationshipTypeEnum.Parent },

            },
          },
        },
        result: {
          data: {
            addChild: {
              child: {
                id: 'new-child-1',
                name: 'Testi Lapsi',
                birthyear: 2022,
                postalCode: '00100',
                project: {
                  id: 'proj-1',
                  name: 'Testiorganisaatio',
                  year: 2022,
                },
              },
            },
          },
        },
      };

      const user = userEvent.setup();
      render(<ProfileChildrenList />, [addChildMock, profileRefetchMock]);

      await user.click(getAddChildButton());
      const dialog = await screen.findByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: 'Lisää lapsi' }));

      await waitFor(() =>
        expect(mockRefetchProfile).toHaveBeenCalledTimes(1)
      );
      expect(mockTrackEvent).toHaveBeenCalledWith({
        category: 'action',
        action: 'Add child',
      });
    });

    it('shows an error toast and captures exception when addChild mutation fails', async () => {
      mockProfile(baseProfile);
      vi.spyOn(NotEligibleUtils, 'isChildEligible').mockReturnValue(true);
      prefillStore();

      const failingMock: MockedResponse = {
        request: {
          query: addChildMutation,
          variables: {
            input: {
              name: 'Testi Lapsi',
              birthyear: 2022,
              postalCode: '00100',
              relationship: { type: RelationshipTypeEnum.Parent },

            },
          },
        },
        error: new Error('Network error'),
      };

      const user = userEvent.setup();
      render(<ProfileChildrenList />, [failingMock]);

      await user.click(getAddChildButton());
      const dialog = await screen.findByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: 'Lisää lapsi' }));

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          'Lapsen tietojen lisäämisessä tapahtui virhe. Yritä uudestaan.'
        )
      );
      expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    });
  });
});
