/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { screen } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';

import EditProfileModal from '../EditProfileModal';
import { MyProfile } from '../../types/ProfileQueryTypes';
import { Language } from '../../../api/generatedTypes/graphql';
import {
  render,
  fireEvent,
  waitFor,
} from '../../../../common/test/testingLibraryUtils';
import initModal from '../../../../common/test/initModal';
import { languagesQueryResponse } from '../../../app/footer/__mocks__/languagesMock';
import { languagesQuery } from '../../../languages/queries/LanguageQueries';

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
  result: { ...languagesQueryResponse },
};

const mocks: MockedResponse[] = [languagesMock];

const getHdsSelect = (elements: HTMLElement[]) => {
  return elements[0].parentElement;
};

const selectOption = (
  selectWrapper: HTMLElement | null,
  optionLabel: string
) => {
  const button = selectWrapper?.querySelector('button');
  const input = selectWrapper?.querySelector('input');
  const controller = button || input;

  if (!controller) {
    throw Error('Could not find controlling element');
  }

  fireEvent.click(controller);

  const options = selectWrapper?.querySelectorAll('[role="option"]');
  const optionToBeSelected = Array.from(options || []).find((element) => {
    return element.textContent === optionLabel;
  });

  if (!optionToBeSelected) {
    throw Error(`Option with label "${optionLabel}" could not be found`);
  }

  fireEvent.click(optionToBeSelected);
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
  initModal();
  render(<EditProfileModal {...defaultProps} />, mocks);

  fireEvent.change(screen.getByRole('textbox', { name: 'Puhelinnumero *' }), {
    target: { value: formData.phoneNumber },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Etunimi *' }), {
    target: { value: formData.firstName },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Sukunimi *' }), {
    target: {
      value: formData.lastName,
    },
  });
  selectOption(
    getHdsSelect(screen.getAllByRole('button', { name: /asiointikieli \*/i })),
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
        screen.getAllByRole('button', { name: /asiointikieli \*/i })
      )?.querySelector('button')?.textContent
    ).toEqual('Suomi');
  });
}, 10_000);
