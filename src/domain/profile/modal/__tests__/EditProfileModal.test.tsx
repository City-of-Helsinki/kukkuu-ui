import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/client/testing';

import EditProfileModal from '../EditProfileModal';
import { ProfileType } from '../../type/ProfileTypes';
import { Language } from '../../../api/generatedTypes/globalTypes';
import { shallowWithProvider } from '../../../../common/test/testUtils';
import { render, fireEvent } from '../../../../common/test/testingLibraryUtils';
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
  render(<EditProfileModal {...defaultProps} {...props} />);

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
  const element = shallowWithProvider(
    <MockedProvider>
      <EditProfileModal
        initialValues={initialValues}
        isOpen={true}
        setIsOpen={jest.fn()}
      />
    </MockedProvider>
  );
  expect(toJson(element)).toMatchSnapshot();
});

it('should allow all fields to be filled', () => {
  initModal();
  const result = getWrapper();
  const { getByLabelText, getAllByLabelText, queryByDisplayValue } = result;

  fireEvent.change(getByLabelText('Sähköpostiosoite *'), {
    target: { value: formData.email },
  });
  fireEvent.change(getByLabelText('Puhelinnumero *'), {
    target: { value: formData.phoneNumber },
  });
  fireEvent.change(getByLabelText('Etunimi *'), {
    target: { value: formData.firstName },
  });
  fireEvent.change(getByLabelText('Sukunimi *'), {
    target: {
      value: formData.lastName,
    },
  });
  selectOption(getHdsSelect(getAllByLabelText('Asiointikieli *')), 'Suomi');

  // Because the component submits with a GraphQL hook we don't look
  // at the submit function, but instead just try and verify that we can
  // find all the values we set during this test.
  Object.values(formData).forEach((value) => {
    expect(queryByDisplayValue(value)).not.toEqual(null);
  });
  // Handle select as a special case because it has no input
  expect(
    getHdsSelect(getAllByLabelText('Asiointikieli *'))?.querySelector('button')
      ?.textContent
  ).toEqual('Suomi');
});
