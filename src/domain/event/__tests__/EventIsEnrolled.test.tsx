import React from 'react';

import { render } from '../../../common/test/testingLibraryUtils';
import EventIsEnrolled from '../EventIsEnrolled';

it('renders snapshot correctly', () => {
  const { container } = render(<EventIsEnrolled />);
  expect(container).toMatchSnapshot();
});
