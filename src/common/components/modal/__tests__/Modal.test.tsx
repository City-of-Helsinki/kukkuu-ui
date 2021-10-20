import { shallow } from 'enzyme';

import Modal from '../Modal';

it('renders snapshot correctly', () => {
  const spinner = shallow(
    <Modal isOpen={false} label="foo" toggleModal={jest.fn()}>
      foo
    </Modal>
  );
  expect(spinner.html()).toMatchSnapshot();
});
