import { render, screen, within } from '@testing-library/react';

import AnchorButton from '../AnchorButton';

describe('AnchorButton', () => {
  it('renders with default props', async () => {
    render(<AnchorButton as="button">Test Button</AnchorButton>);

    const buttonElement = await screen.findByRole('button', {
      name: 'Test Button',
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('hds-button');

    const labelElement = within(buttonElement).getByText('Test Button');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('SPAN');
    expect(labelElement).toHaveClass('hds-button__label');
  });

  it('renders with href prop', () => {
    render(<AnchorButton href="/test">Test Link</AnchorButton>);
    const linkElement = screen.getByRole('link', { name: 'Test Link' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test');
    expect(linkElement).toHaveClass('hds-button');
  });

  it('renders with className prop', () => {
    render(
      <AnchorButton className="custom-class" role="button">
        Test Button
      </AnchorButton>
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Button' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('hds-button');
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('renders with data-testid prop', () => {
    render(<AnchorButton data-testid="test-button">Test Button</AnchorButton>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});
