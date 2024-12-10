import { render } from '@testing-library/react';
import ReactModal from 'react-modal';

import Modal from '../Modal';
import { screen } from '../../../test/testingLibraryUtils';

/**
 * ReactModal.setAppElement is used to prevent the following warning when
 * running tests that use an open Modal component:
 *
 * "Warning: react-modal: App element is not defined.
 * Please use `Modal.setAppElement(el)` or set `appElement={el}`.
 * This is needed so screen readers don't see main content when modal is opened.
 * It is not recommended, but you can opt-out by setting `ariaHideApp={false}`."
 */
ReactModal.setAppElement(
  document.body.appendChild(document.createElement('div'))
);

it('renders snapshot correctly', () => {
  const { container: spinner } = render(
    <Modal isOpen={false} label="foo" toggleModal={vi.fn()}>
      foo
    </Modal>
  );
  expect(spinner).toMatchSnapshot();
});

it('renders mandatory field legend by default', async () => {
  render(
    <Modal isOpen={true} label="modalLabel" toggleModal={vi.fn()}>
      foo
    </Modal>
  );
  await screen.findByText('modalLabel');
  const legend = await screen.findByTestId('mandatory-field-legend');
  expect(legend.textContent).toBe('* tarkoittaa pakollista kenttää');
});

it('renders mandatory field legend when asked to', async () => {
  render(
    <Modal
      isOpen={true}
      label="modalLabel"
      toggleModal={vi.fn()}
      showMandatoryFieldLegend
    >
      foo
    </Modal>
  );
  await screen.findByText('modalLabel');
  const legend = await screen.findByTestId('mandatory-field-legend');
  expect(legend.textContent).toBe('* tarkoittaa pakollista kenttää');
});

it('omits mandatory field legend when asked to', async () => {
  render(
    <Modal
      isOpen={true}
      label="modalLabel"
      toggleModal={vi.fn()}
      showMandatoryFieldLegend={false}
    >
      foo
    </Modal>
  );
  await screen.findByText('modalLabel');
  expect(
    screen.queryByTestId('mandatory-field-legend')
  ).not.toBeInTheDocument();
});
