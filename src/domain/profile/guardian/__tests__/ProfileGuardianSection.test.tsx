import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { customRender as render } from '../../../../common/test/customRender';
import ProfileGuardianSection from '../ProfileGuardianSection';
import { MyProfile } from '../../types/ProfileQueryTypes';

vi.mock('../../modal/EditProfileModal', () => ({
  default: ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) =>
    isOpen ? (
      <div data-testid="edit-profile-modal">
        <button onClick={() => setIsOpen(false)}>Close modal</button>
      </div>
    ) : null,
}));

const mockProfile: MyProfile = {
  id: 'guardian-1',
  firstName: 'Maija',
  lastName: 'Meikäläinen',
  email: 'maija.meikalainen@kotiposti.com',
  phoneNumber: '+3580 45 123 4567',
  language: 'fi' as any,
  hasAcceptedCommunication: true,
  children: { edges: [], __typename: 'ChildNodeConnection' },
  languagesSpokenAtHome: { edges: [], __typename: 'LanguageNodeConnection' },
};

describe('ProfileGuardianSection', () => {
  it('renders guardian details and heading', () => {
    render(<ProfileGuardianSection profile={mockProfile} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Lähiaikuinen' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Maija Meikäläinen' })
    ).toBeInTheDocument();
    expect(screen.getByText('p. +3580 45 123 4567')).toBeInTheDocument();
    expect(
      screen.getByText('maija.meikalainen@kotiposti.com')
    ).toBeInTheDocument();
  });

  it('has accessible edit button that opens edit modal on click', async () => {
    const user = userEvent.setup();
    render(<ProfileGuardianSection profile={mockProfile} />);

    const editButton = screen.getByRole('button', {
      name: /muokkaa lähiaikuisen tietoja/i,
    });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('aria-haspopup', 'dialog');

    await user.click(editButton);
    expect(screen.getByTestId('edit-profile-modal')).toBeInTheDocument();
  });
});
