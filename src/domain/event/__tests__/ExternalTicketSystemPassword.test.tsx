// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../common/test/customRender';
import ExternalTicketSystemPassword from '../ExternalTicketSystemPassword';

const mockCopy = vi.fn();

vi.mock('copy-to-clipboard', () => ({
  default: (...args) => mockCopy(...args),
}));

describe('ExternalTicketSystemPassword', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the password', () => {
    render(<ExternalTicketSystemPassword password="SECRET123" />, []);

    expect(screen.getByText('SECRET123')).toBeInTheDocument();
  });

  it('renders the copy button', () => {
    render(<ExternalTicketSystemPassword password="SECRET123" />, []);

    expect(
      screen.getByRole('button', { name: 'Kopioi salasana' })
    ).toBeInTheDocument();
  });

  it('shows success indicator after successful copy', async () => {
    mockCopy.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ExternalTicketSystemPassword password="SECRET123" />, []);

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).toHaveBeenCalledWith('SECRET123');
    // Success checkmark icon appears
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show success indicator when copy fails', async () => {
    mockCopy.mockReturnValue(false);
    const user = userEvent.setup();

    const { container } = render(
      <ExternalTicketSystemPassword password="SECRET123" />,
      []
    );

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).toHaveBeenCalledWith('SECRET123');
    expect(container.querySelector('.successWrapper')).not.toBeInTheDocument();
  });

  it('does not call copy when password is null', async () => {
    mockCopy.mockReturnValue(false);
    const user = userEvent.setup();
    render(<ExternalTicketSystemPassword password={null} />, []);

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).not.toHaveBeenCalled();
  });
});
