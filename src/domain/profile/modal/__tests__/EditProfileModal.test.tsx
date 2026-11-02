import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedResponse } from '@apollo/client/testing';

import EditProfileModal from '../EditProfileModal';
import { MyProfile } from '../../types/ProfileQueryTypes';
import { Language } from '../../../api/generatedTypes/graphql';
import { customRender as render } from '../../../../common/test/customRender';
import initModal from '../../../../common/test/initModal';
import { languagesQuery } from '../../../languages/queries/LanguageQueries';
import { HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE } from '../../../languages/constants';

const initialValues: MyProfile = {
  id: 'yuiop',
  firstName: 'asdf',
  lastName: 'fdsa',
  phoneNumber: '0904422233',
  email: 'email@example.com',
  language: Language.Sv,
  hasAcceptedCommunication: false,
  children: {
    edges: [],
  },
  languagesSpokenAtHome: {
    edges: [],
  },
};

const defaultProps = {
  initialValues,
  isOpen: true,
  setIsOpen: () => {},
};

const formData = {
  phoneNumber: '000000000',
  firstName: 'George',
  lastName: 'Lopez',
};

const languagesMock: MockedResponse = {
  request: {
    query: languagesQuery,
    variables: {},
  },
  result: { ...HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE },
};

const mocks: MockedResponse[] = [languagesMock];

const getHdsSelect = (elements: HTMLElement[]) => {
  return elements[0].parentElement;
};

const selectOption = async (
  user: ReturnType<typeof userEvent.setup>,
  selectWrapper: HTMLElement | null,
  optionLabel: string
) => {
  const button = selectWrapper?.querySelector('button');
  const input = selectWrapper?.querySelector('input');
  const controller = button || input;

  if (!controller) {
    throw Error('Could not find controlling element');
  }

  await user.click(controller);

  // Wait for options to appear in document.body (HDS 4.x renders in portal)
  await waitFor(() => {
    const options = document.body.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
  });

  const options = document.body.querySelectorAll('[role="option"]');
  const optionToBeSelected = Array.from(options || []).find((element) => {
    return element.textContent === optionLabel;
  });

  if (!optionToBeSelected) {
    throw Error(`Option with label "${optionLabel}" could not be found`);
  }

  await user.click(optionToBeSelected);
};

it('renders snapshot correctly', () => {
  initModal();
  const { container } = render(
    <EditProfileModal
      initialValues={initialValues}
      isOpen={true}
      setIsOpen={vi.fn()}
    />,
    mocks
  );
  expect(container).toMatchSnapshot();
});

it('should allow all fields to be filled', async () => {
  const user = userEvent.setup();
  initModal();
  render(<EditProfileModal {...defaultProps} />, mocks);

  const phoneInput = screen.getByRole('textbox', { name: 'Puhelinnumero *' });
  await user.clear(phoneInput);
  await user.type(phoneInput, formData.phoneNumber);

  const firstNameInput = screen.getByRole('textbox', { name: 'Etunimi *' });
  await user.clear(firstNameInput);
  await user.type(firstNameInput, formData.firstName);

  const lastNameInput = screen.getByRole('textbox', { name: 'Sukunimi *' });
  await user.clear(lastNameInput);
  await user.type(lastNameInput, formData.lastName);

  await selectOption(
    user,
    getHdsSelect(screen.getAllByRole('combobox', { name: /asiointikieli/i })),
    'Suomi'
  );

  // Because the component submits with a GraphQL hook we don't look
  // at the submit function, but instead just try and verify that we can
  // find all the values we set during this test.
  Object.values(formData).forEach((value) => {
    expect(screen.queryByDisplayValue(value)).not.toEqual(null);
  });
  // Handle select as a special case because it has no input
  await waitFor(() => {
    expect(
      getHdsSelect(
        screen.getAllByRole('combobox', { name: /asiointikieli/i })
      )?.querySelector('button')?.textContent
    ).toContain('Suomi');
  });
}, 10_000);
