import { render } from '@testing-library/react';

import NavigationConfirm from '../NavigationConfirm';

it('renders snapshot correctly', () => {
  const { container } = render(<NavigationConfirm isHalfFilling={true} />);
  expect(container).toMatchSnapshot();
});
