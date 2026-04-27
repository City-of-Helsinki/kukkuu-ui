import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import NotFound from '../NotFound';

describe('NotFound', () => {
  it('renders the 404 heading and message', () => {
    render(<NotFound />, []);

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(
      screen.getByText('Etsimääsi sivua ei löytynyt')
    ).toBeInTheDocument();
  });

  it('renders a link back to the front page with the correct href', () => {
    render(<NotFound />, []);

    const link = screen.getByRole('link', {
      name: 'Palaa palvelun etusivulle',
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
