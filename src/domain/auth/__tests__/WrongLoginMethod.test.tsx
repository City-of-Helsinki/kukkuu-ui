import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../common/test/customRender';
import WrongLoginMethod from '../WrongLoginMethod';

const mockLogout = vi.fn();

vi.mock('../useLogout', () => ({
  default: () => mockLogout,
}));

describe('WrongLoginMethod', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title and description', () => {
    render(<WrongLoginMethod />, []);

    expect(screen.getByText('Hupsista!')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Vaikuttaisi siltä, että olet käyttänyt eri tunnistautumistapaa/i
      )
    ).toBeInTheDocument();
  });

  it('calls logout when the logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<WrongLoginMethod />, []);

    await user.click(screen.getByRole('button', { name: 'Kirjaudu ulos' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
