import { render, screen } from '@testing-library/react';

import LoadingSpinner from '../LoadingSpinner';

it('renders snapshot correctly', () => {
  const { container } = render(<LoadingSpinner isLoading={false} />);
  expect(container).toMatchSnapshot();
});

it('render spinner if isLoading is true', () => {
  const { container } = render(<LoadingSpinner isLoading={true} />);
  expect(container.innerHTML).toContain('spinner');
});

it('render child component if isLoading is false', async () => {
  render(
    <LoadingSpinner isLoading={false}>
      <div className="component"></div>
    </LoadingSpinner>
  );
  expect(
    await screen.findByText(
      (content, element) => element?.className === 'component'
    )
  ).toBeInTheDocument();
});
