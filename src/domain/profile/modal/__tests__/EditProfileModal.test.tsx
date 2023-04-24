import { MockedProvider } from '@apollo/client/testing';
import React from 'react';

import EditProfileModal from '../EditProfileModal';
import { ProfileType } from '../../type/ProfileTypes';
import { Language } from '../../../api/generatedTypes/globalTypes';
import {
  render,
  fireEvent,
  waitFor,
} from '../../../../common/test/testingLibraryUtils';
import initModal from '../../../../common/test/initModal';

const initialValues: ProfileType = {
  id: 'yuiop',
  firstName: 'asdf',
  lastName: 'fdsa',
  phoneNumber: '0904422233',
  email: 'email@example.com',
  language: Language.SV,
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsOpen: () => {},
};
const getWrapper = (props?: unknown) =>
  render(<EditProfileModal {...defaultProps} {...(props ?? {})} />);

const formData = {
  email: 'some@domain.fi',
  phoneNumber: '000000000',
  firstName: 'George',
  lastName: 'Lopez',
};

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
    <MockedProvider>
      <EditProfileModal
        initialValues={initialValues}
        isOpen={true}
        setIsOpen={jest.fn()}
      />
    </MockedProvider>
  );
  expect(container).toMatchSnapshot();
});

it('should allow all fields to be filled', async () => {
  initModal();
  const result = getWrapper();
  const { getByRole, getAllByRole, queryByDisplayValue } = result;

  fireEvent.change(
    getByRole('textbox', {
      name: 'Sähköpostiosoite *',
    }),
    {
      target: { value: formData.email },
    }
  );
  fireEvent.change(getByRole('textbox', { name: 'Puhelinnumero *' }), {
    target: { value: formData.phoneNumber },
  });
  fireEvent.change(getByRole('textbox', { name: 'Etunimi *' }), {
    target: { value: formData.firstName },
  });
  fireEvent.change(getByRole('textbox', { name: 'Sukunimi *' }), {
    target: {
      value: formData.lastName,
    },
  });
  selectOption(
    getHdsSelect(getAllByRole('button', { name: /asiointikieli \*/i })),
    'Suomi'
  );

  // Because the component submits with a GraphQL hook we don't look
  // at the submit function, but instead just try and verify that we can
  // find all the values we set during this test.
  Object.values(formData).forEach((value) => {
    expect(queryByDisplayValue(value)).not.toEqual(null);
  });
  // Handle select as a special case because it has no input
  await waitFor(() => {
    expect(
      getHdsSelect(
        getAllByRole('button', { name: /asiointikieli \*/i })
      )?.querySelector('button')?.textContent
    ).toEqual('Suomi');
  });
});
