import { MockedResponse } from '@apollo/client/testing';

import RegistrationForm, {
  EMAIL_FIELD_TESTID,
  FORM_TESTID,
} from '../RegistrationForm';
import { render, screen } from '../../../../common/test/testingLibraryUtils';
import { languagesQuery } from '../../../languages/queries/LanguageQueries';
import { languagesQueryResponse } from '../../../app/footer/__mocks__/languagesMock';
import profileQuery from '../../../profile/queries/ProfileQuery';

const emptyProfileMock: MockedResponse = {
  request: {
    query: profileQuery,
    variables: {},
  },
  result: {
    data: { myProfile: null },
  },
};

const languagesMock: MockedResponse = {
  request: {
    query: languagesQuery,
    variables: {},
  },
  result: { ...languagesQueryResponse },
};

const mocks: MockedResponse[] = [emptyProfileMock, languagesMock];

function renderRegistrationForm(props = {}) {
  return render(<RegistrationForm {...props} />, mocks);
}

it('renders snapshot correctly', async () => {
  const { container } = renderRegistrationForm();
  await screen.findByTestId(FORM_TESTID);
  expect(container).toMatchSnapshot();
});

it('email field is disabled', async () => {
  renderRegistrationForm();
  const emailField = await screen.findByTestId(EMAIL_FIELD_TESTID);
  expect(emailField).toBeDisabled();
});

it('hasAcceptedCommunication is checked by default', async () => {
  renderRegistrationForm();
  const hasAcceptedCommunicationCheckbox = await screen.findByRole('checkbox', {
    name: 'Haluan viestejä uusista kummitapahtumista',
  });
  expect(hasAcceptedCommunicationCheckbox).toBeChecked();
});
