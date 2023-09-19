import { render } from '@testing-library/react';

import HomeVideo from '../HomeVideo';

it('renders snapshot correctly', () => {
  const { container } = render(<HomeVideo />);
  expect(container).toMatchSnapshot();
});
