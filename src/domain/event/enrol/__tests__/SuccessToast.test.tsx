import React from 'react';
import toJson from 'enzyme-to-json';

import SuccessToast from '../SuccessToast';
import { mountWithProvider } from '../../../../common/test/testUtils';

it('renders snapshot correctly', () => {
  const element = mountWithProvider(<SuccessToast />);
  expect(toJson(element)).toMatchSnapshot();
});
