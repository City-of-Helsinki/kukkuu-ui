import toJson from 'enzyme-to-json';

import AddNewChildFormModal from '../AddNewChildFormModal';
import { shallowWithProvider } from '../../../../common/test/testUtils';

it('renders snapshot correctly', () => {
  const element = shallowWithProvider(
    <AddNewChildFormModal isOpen={true} setIsOpen={jest.fn()} />
  );
  expect(toJson(element)).toMatchSnapshot();
});
