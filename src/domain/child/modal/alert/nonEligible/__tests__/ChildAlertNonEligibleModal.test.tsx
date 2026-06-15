import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../../../common/test/customRender';
import ChildAlertNonEligibleModal from '../ChildAlertNonEligibleModal';

describe('ChildAlertNonEligibleModal', () => {
  it('renders the heading, description and close button', () => {
    render(<ChildAlertNonEligibleModal setIsOpen={vi.fn()} />, []);

    expect(screen.getByText('Voi harmi!')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Valitettavasti lapsen syntymävuosi tai kotipaikkakunta/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Palaa profiilin luomiseen' })
    ).toBeInTheDocument();
  });

  it('calls setIsOpen(false) when the close button is clicked', async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    render(<ChildAlertNonEligibleModal setIsOpen={setIsOpen} />, []);

    await user.click(
      screen.getByRole('button', { name: 'Palaa profiilin luomiseen' })
    );

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
