import { render, screen } from '@testing-library/react';

import AnchorButton from '../AnchorButton';

describe('AnchorButton', () => {
  it('renders with default props', async () => {
    render(<AnchorButton as="button">Test Button</AnchorButton>);
    const buttonElement = await screen.findByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('hds-button__label');
  });

  it('renders with href prop', () => {
    render(<AnchorButton href="/test">Test Link</AnchorButton>);
    const linkElement = screen.getByRole('link', { name: 'Test Link' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test');
  });

  it('renders with className prop', () => {
    render(
      <AnchorButton className="custom-class" role="button">
        Test Button
      </AnchorButton>
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Button' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('renders with other props', () => {
    render(<AnchorButton data-testid="test-button">Test Button</AnchorButton>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});
