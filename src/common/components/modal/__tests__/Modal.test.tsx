import { render } from '@testing-library/react';

import Modal from '../Modal';

it('renders snapshot correctly', () => {
  const { container: spinner } = render(
    <Modal isOpen={false} label="foo" toggleModal={vi.fn()}>
      foo
    </Modal>
  );
  expect(spinner).toMatchSnapshot();
});
