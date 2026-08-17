// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../common/test/customRender';
import ExternalTicketSystemPassword from '../ExternalTicketSystemPassword';
import styles from '../externalTicketSystemPassword.module.scss';

const mockCopy = vi.fn();

vi.mock('copy-to-clipboard', () => ({
  default: (...args) => mockCopy(...args),
}));

describe('ExternalTicketSystemPassword', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // The password is case sensitive: it must be rendered and copied verbatim.
  it('renders the password with its original casing', () => {
    render(<ExternalTicketSystemPassword password="mIxEd-CaSe-123" />, []);

    expect(screen.getByText('mIxEd-CaSe-123')).toBeInTheDocument();
  });

  it('renders the copy button', () => {
    render(<ExternalTicketSystemPassword password="mIxEd-CaSe-123" />, []);

    expect(
      screen.getByRole('button', { name: 'Kopioi salasana' })
    ).toBeInTheDocument();
  });

  it('shows success indicator after successful copy', async () => {
    mockCopy.mockReturnValue(true);
    const user = userEvent.setup();
    const { container } = render(
      <ExternalTicketSystemPassword password="mIxEd-CaSe-123" />,
      []
    );

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).toHaveBeenCalledWith('mIxEd-CaSe-123');
    expect(
      container.querySelector(`.${styles.successWrapper}`)
    ).toBeInTheDocument();
  });

  it('does not show success indicator when copy fails', async () => {
    mockCopy.mockReturnValue(false);
    const user = userEvent.setup();

    const { container } = render(
      <ExternalTicketSystemPassword password="mIxEd-CaSe-123" />,
      []
    );

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).toHaveBeenCalledWith('mIxEd-CaSe-123');
    expect(
      container.querySelector(`.${styles.successWrapper}`)
    ).not.toBeInTheDocument();
  });

  it('does not call copy when password is null', async () => {
    mockCopy.mockReturnValue(false);
    const user = userEvent.setup();
    render(<ExternalTicketSystemPassword password={null} />, []);

    await user.click(screen.getByRole('button', { name: 'Kopioi salasana' }));

    expect(mockCopy).not.toHaveBeenCalled();
  });
});
