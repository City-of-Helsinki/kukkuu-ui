import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChildConfirmDeleteModal from '../ChildConfirmDeleteModal';
import { customRender as render } from '../../../../../../common/test/customRender';

describe('ChildConfirmDeleteModal', () => {
  const mockDeleteChild = vi.fn();
  const mockSetIsOpen = vi.fn();

  const renderModal = () =>
    render(
      <ChildConfirmDeleteModal
        deleteChild={mockDeleteChild}
        setIsOpen={mockSetIsOpen}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with correct heading and content', () => {
    renderModal();

    expect(
      screen.getByRole('heading', {
        name: 'Haluatko varmasti poistaa lapsen tiedot?',
      })
    ).toBeInTheDocument();
  });

  it('calls deleteChild when OK button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    const okButton = screen.getByRole('button', { name: /Poista/i });
    await user.click(okButton);

    expect(mockDeleteChild).toHaveBeenCalled();
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('calls setIsOpen with false when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    const cancelButton = screen.getByRole('button', { name: /Peruuta/i });
    await user.click(cancelButton);

    expect(mockDeleteChild).not.toHaveBeenCalled();
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});
