// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../../../common/test/customRender';
import ProfileChildDetailEditModal from '../ProfileChildDetailEditModal';
import * as ProfileContextModule from '../../../../hooks/useProfileContext';
import { childData } from '../../../../../child/__mocks__/childMocks';

const mockRefetchProfile = vi.fn();

const defaultProps = {
  setIsOpen: vi.fn(),
  editChild: vi.fn(),
  deleteChild: vi.fn(),
  childBeingEdited: childData,
};

describe('ProfileChildDetailEditModal', () => {
  beforeEach(() => {
    vi.spyOn(ProfileContextModule, 'useProfileContext').mockReturnValue({
      profile: { id: 'profile-1' },
      refetchProfile: mockRefetchProfile,
      clearProfile: vi.fn(),
      updateProfile: vi.fn(),
      isLoading: false,
      isFetchCalled: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderModal = (props = {}) =>
    render(<ProfileChildDetailEditModal {...defaultProps} {...props} />, []);

  const getCancelButton = () =>
    screen.getByRole('button', { name: 'Peruuta' });

  const getDeleteButton = () =>
    screen.getByRole('button', { name: /Poista lapsen tiedot/i });

  it('renders the edit form modal with the correct label', () => {
    renderModal();

    expect(screen.getByText('Muokkaa lapsen tietoja')).toBeInTheDocument();
  });

  it('calls setIsOpen(false) when cancel is clicked', async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    renderModal({ setIsOpen });

    await user.click(getCancelButton());

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('shows the delete confirmation modal when "Poista lapsen tiedot" is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getDeleteButton());

    expect(
      screen.getByText('Haluatko varmasti poistaa lapsen tiedot?')
    ).toBeInTheDocument();
  });

  it('calls deleteChild and setIsOpen(false) when deletion is confirmed', async () => {
    const setIsOpen = vi.fn();
    const deleteChild = vi.fn();
    const user = userEvent.setup();
    renderModal({ setIsOpen, deleteChild });

    await user.click(getDeleteButton());
    // Click the confirm button in the delete confirmation modal
    await user.click(getDeleteButton());

    expect(deleteChild).toHaveBeenCalledTimes(1);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('calls setIsOpen(false) when delete confirmation is cancelled', async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    renderModal({ setIsOpen });

    await user.click(getDeleteButton());
    await user.click(getCancelButton());

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('calls refetchProfile when delete flow is opened', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getDeleteButton());

    expect(mockRefetchProfile).toHaveBeenCalled();
  });
});
