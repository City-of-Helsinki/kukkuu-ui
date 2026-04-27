import { MockedResponse } from '@apollo/client/testing';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RegistrationForm from '../RegistrationForm';
import { EMAIL_FIELD_TESTID, FORM_TESTID } from '../constants';
import { customRender as render } from '../../../../common/test/customRender';
import { languagesQuery } from '../../../languages/queries/LanguageQueries';
import profileQuery from '../../../profile/queries/ProfileQuery';
import { HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE } from '../../../languages/constants';
import { store } from '../../../app/state/AppStore';
import { setFormValues, resetFormValues } from '../../state/RegistrationActions';
import { RelationshipTypeEnum, Language, ProfileQueryDocument } from '../../../api/generatedTypes/graphql';
import * as NotEligibleUtils from '../../notEligible/NotEligibleUtils';
import submitChildrenAndGuardianMutation from '../../mutations/submitChildrenAndGuardianMutation';

// useOidcClient().getUser() returns null in tests — getInitialFormData then sets email='',
// which fails required email validation (the field is disabled, users can't type).
// Use vi.hoisted so the mock reference is available inside the vi.mock factory.
const mockUseOidcClient = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    getUser: () => null,
    isAuthenticated: () => false,
    isRenewing: () => false,
    logout: vi.fn(),
  })
);

vi.mock('hds-react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('hds-react')>();
  return {
    ...mod,
    useOidcClient: mockUseOidcClient,
    useApiTokensClient: () => ({
      getTokens: () => null,
      isRenewing: () => false,
    }),
    useApiTokensClientTracking: () => undefined,
  };
});

// submitChildrenAndGuardian passes client: graphqlClient to useMutation.
// Setting it to undefined makes Apollo fall back to MockedProvider's context client.
vi.mock('../../../api/client', () => ({ default: undefined }));

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router')>();
  return { ...mod, useNavigate: () => mockNavigate };
});

// Prevent refetchProfile() (called in the mutation's onCompleted) from firing
// ProfileQueryDocument requests that would exhaust the mock queue.
vi.mock('../../../profile/hooks/useProfileContext', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('../../../profile/hooks/useProfileContext')
  >();
  return {
    ...mod,
    useProfileContext: vi.fn().mockReturnValue({
      profile: null,
      clearProfile: vi.fn(),
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      isLoading: false,
      isFetchCalled: true,
    }),
  };
});

const emptyProfileMock: MockedResponse = {
  request: {
    query: profileQuery,
    variables: {},
  },
  result: {
    data: { myProfile: null },
  },
  newData: () => ({ data: { myProfile: null } }),
};

const languagesMock: MockedResponse = {
  request: {
    query: languagesQuery,
    variables: {},
  },
  result: { ...HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE },
};

const mocks: MockedResponse[] = [emptyProfileMock, languagesMock];

const validChild = {
  birthyear: 2020,
  name: 'Test Child',
  homeCity: 'Helsinki',
  postalCode: '00100',
  relationship: { type: RelationshipTypeEnum.Parent },
  languagesSpokenAtHome: [] as string[],
};

function renderRegistrationForm(props = {}) {
  return render(<RegistrationForm {...props} />, mocks);
}

const getAddChildButton = () =>
  screen.getByRole('button', { name: 'Lisää lapsi' });
const getSubmitButton = () =>
  screen.getByRole('button', { name: 'Ilmoittaudu mukaan' });

describe('RegistrationForm', () => {
  beforeEach(() => {
    store.dispatch(resetFormValues());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    mockUseOidcClient.mockReturnValue({
      getUser: () => null,
      isAuthenticated: () => false,
      isRenewing: () => false,
      logout: vi.fn(),
    });
  });
  it('shows a loading spinner before data is fetched', () => {
    renderRegistrationForm();
    expect(screen.getByLabelText('Lataa')).toBeInTheDocument();
  });

  describe('form content', () => {
    it('renders the main registration heading', async () => {
      renderRegistrationForm();
      expect(
        await screen.findByRole('heading', { name: 'Tule mukaan' })
      ).toBeInTheDocument();
    });

    it('renders the child info section heading', async () => {
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);
      expect(
        screen.getByRole('heading', { name: 'Lapsen tiedot' })
      ).toBeInTheDocument();
    });

    it('renders the guardian info section heading', async () => {
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);
      expect(
        screen.getByRole('heading', { name: 'Lähiaikuisen tiedot' })
      ).toBeInTheDocument();
    });

    it('renders the guardian form fields', async () => {
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);
      expect(screen.getByLabelText(/Sähköpostiosoite/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Puhelinnumero/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Etunimi/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Sukunimi/i)).toBeInTheDocument();
    });

    it('email field is disabled', async () => {
      renderRegistrationForm();
      const emailField = await screen.findByTestId(EMAIL_FIELD_TESTID);
      expect(emailField).toBeDisabled();
    });

    it('hasAcceptedCommunication is checked by default', async () => {
      renderRegistrationForm();
      expect(
        await screen.findByRole('checkbox', {
          name: 'Haluan viestejä uusista kummitapahtumista',
        })
      ).toBeChecked();
    });

    it('renders the add child button', async () => {
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);
      expect(getAddChildButton()).toBeInTheDocument();
    });

    it('renders the submit button', async () => {
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);
      expect(getSubmitButton()).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('opens AddNewChildFormModal when the add child button is clicked', async () => {
      const user = userEvent.setup();
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);

      await user.click(getAddChildButton());

      expect(
        await screen.findByRole('heading', { level: 2, name: 'Lisää lapsi' })
      ).toBeInTheDocument();
    });

    it('adds the child to the form when submitted from the modal', async () => {
      // Pre-seed the Redux store so the modal form starts with valid initial values,
      // avoiding interaction with the HDS Select (relationship dropdown).
      store.dispatch(
        setFormValues({
          ...store.getState().registration.formValues,
          children: [validChild],
        })
      );
      vi.spyOn(NotEligibleUtils, 'isChildEligible').mockReturnValue(true);

      const user = userEvent.setup();
      renderRegistrationForm();
      await screen.findByTestId(FORM_TESTID);

      // Open the modal
      await user.click(getAddChildButton());
      const modal = await screen.findByRole('dialog');

      // Submit the child form inside the modal
      const modalSubmit = within(modal).getByRole('button', {
        name: 'Lisää lapsi',
      });
      await user.click(modalSubmit);

      // The modal should close and arrayHelpers.push should have added a second
      // child section — so the birthyear now appears twice in the form.
      await screen.findAllByText(validChild.birthyear.toString());
      expect(screen.getAllByText(validChild.birthyear.toString())).toHaveLength(
        2
      );
    });

    it('calls onSubmit, dispatches form values and navigates on valid full-form submit', async () => {
      // Provide a user with email so getInitialFormData populates the disabled email field.
      mockUseOidcClient.mockReturnValue({
        getUser: () => ({
          profile: {
            email: 'test@example.com',
            given_name: 'Test',
            family_name: 'User',
          },
        }),
        isAuthenticated: () => false,
        isRenewing: () => false,
        logout: vi.fn(),
      });

      // Pre-seed the store with all valid form values so validation passes.
      store.dispatch(
        setFormValues({
          ...store.getState().registration.formValues,
          children: [validChild],
          guardian: {
            email: '',  // overridden by getInitialFormData with user.profile.email
            firstName: 'Test',
            lastName: 'User',
            phoneNumber: '0501234567',
            languagesSpokenAtHome: [],
            hasAcceptedCommunication: false,  // overridden to true by getInitialFormData
          },
          agree: true,
        })
      );

      const submitMock: MockedResponse = {
        request: {
          query: submitChildrenAndGuardianMutation,
          variables: {
            children: [
              {
                name: 'Test Child',
                languagesSpokenAtHome: [],
                birthyear: 2020,
                postalCode: '00100',
                relationship: { type: RelationshipTypeEnum.Parent },
              },
            ],
            guardian: {
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              phoneNumber: '0501234567',
              language: Language.Fi,
              languagesSpokenAtHome: [],
              hasAcceptedCommunication: true,
            },
          },
        },
        result: {
          data: {
            submitChildrenAndGuardian: {
              guardian: {
                id: 'guardian-1',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                phoneNumber: '0501234567',
                language: Language.Fi,
                hasAcceptedCommunication: true,
                children: { edges: [] },
              },
            },
          },
        },
      };

      // One extra profileQuery mock for the mutation's refetchQueries.
      const profileRefetchMock: MockedResponse = {
        request: { query: profileQuery, variables: {} },
        result: { data: { myProfile: null } },
        newData: () => ({ data: { myProfile: null } }),
      };
      // Also cover ProfileQueryDocument (generated) used internally by useProfileFetcher.
      const profileDocumentMock: MockedResponse = {
        request: { query: ProfileQueryDocument, variables: {} },
        result: { data: { myProfile: null } },
        newData: () => ({ data: { myProfile: null } }),
      };

      const user = userEvent.setup();
      render(<RegistrationForm />, [
        emptyProfileMock,
        languagesMock,
        submitMock,
        profileRefetchMock,
        profileDocumentMock,
      ]);

      await screen.findByTestId(FORM_TESTID);
      await user.click(getSubmitButton());

      // After successful submit the component calls navigate() to the success route.
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('/registration/success')
        )
      );
    });
  });
});
