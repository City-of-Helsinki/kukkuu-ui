import { render } from '@testing-library/react';

import LoadingSpinner from '../LoadingSpinner';

it('renders snapshot correctly', () => {
  const { container } = render(<LoadingSpinner isLoading={false} />);
  expect(container).toMatchSnapshot();
});

it('render spinner if isLoading is true', () => {
  const { container } = render(<LoadingSpinner isLoading={true} />);
  expect(container.innerHTML).toContain('spinner');
});

it('render child component if isLoading is false', () => {
  const { container } = render(
    <LoadingSpinner isLoading={false}>
      <div className="component"></div>
    </LoadingSpinner>
  );
  expect(container.children[0].className).toEqual('component');
});
