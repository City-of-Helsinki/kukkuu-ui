import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { UnconnectedHomePreliminaryForm } from '../HomePreliminaryForm';
import { defaultRegistrationData } from '../../../registration/state/RegistrationReducers';

it('renders snapshot correctly', () => {
  const element = shallow(
    <UnconnectedHomePreliminaryForm
      isAuthenticated={true}
      stateFormValues={defaultRegistrationData.formValues}
      setFormValues={jest.fn()}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});
