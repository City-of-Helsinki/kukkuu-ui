import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import { publicSvgIconPaths } from '../../../../public_files';
import ApplicationError from '../ApplicationError';

describe('ApplicationError', () => {
  it('renders translated content', () => {
    render(<ApplicationError />);

    expect(
      screen.getByRole('heading', { name: 'Virhe tapahtui' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Jokin meni pieleen\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Etusivulle' })).toBeInTheDocument();
  });

  it('links to the homepage and renders the icon', () => {
    render(<ApplicationError />);

    const returnLink = screen.getByRole('link', { name: 'Etusivulle' });
    expect(returnLink).toHaveAttribute('href', '/');

    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', publicSvgIconPaths.adultFace);
  });
});
