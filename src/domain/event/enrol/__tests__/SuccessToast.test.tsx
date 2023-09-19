import { store } from '../../../../domain/app/state/AppStore';
import SuccessToast from '../SuccessToast';
import { justEnrolled } from '../../state/EventActions';
import { render } from '../../../../common/test/testingLibraryUtils';

store.dispatch(justEnrolled());

it('renders snapshot correctly', () => {
  const { container } = render(<SuccessToast />);
  expect(container).toMatchSnapshot();
});
