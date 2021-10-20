import toJson from 'enzyme-to-json';

import { store } from '../../../../domain/app/state/AppStore';
import SuccessToast from '../SuccessToast';
import { mountWithProvider } from '../../../../common/test/testUtils';
import { justEnrolled } from '../../state/EventActions';

store.dispatch(justEnrolled());

it('renders snapshot correctly', () => {
  const element = mountWithProvider(<SuccessToast />);
  expect(toJson(element)).toMatchSnapshot();
});
