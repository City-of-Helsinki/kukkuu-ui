import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import HomeCmsContent from '../HomeCmsContent';

describe('<HomeCmsContent />', () => {
  it('renders nothing when content is undefined or empty whitespace', () => {
    const { container: emptyContainer } = render(
      <HomeCmsContent content="" />
    );
    expect(emptyContainer).toBeEmptyDOMElement();

    const { container: whitespaceContainer } = render(
      <HomeCmsContent content="   " />
    );
    expect(whitespaceContainer).toBeEmptyDOMElement();

    const { container: nullContainer } = render(
      <HomeCmsContent content={null} />
    );
    expect(nullContainer).toBeEmptyDOMElement();
  });

  it('renders skeleton placeholder while isLoading is true', () => {
    render(<HomeCmsContent content="<p>Teksti</p>" isLoading={true} />);

    expect(screen.getByTestId('home-cms-content')).toHaveAttribute(
      'aria-busy',
      'true'
    );
    expect(
      screen.getByTestId('home-cms-content-skeleton')
    ).toBeInTheDocument();
    expect(screen.queryByText('Teksti')).not.toBeInTheDocument();
  });

  it('renders CMS content via PageMainContent when content is provided', () => {
    const htmlContent = `
      <h2>Tietoa palvelusta</h2>
      <p>Kulttuurin kummilapset kutsuu lapset taiteen ja kulttuurin pariin.</p>
    `;

    render(<HomeCmsContent content={htmlContent} />);

    expect(screen.getByTestId('home-cms-content')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Tietoa palvelusta' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Kulttuurin kummilapset kutsuu lapset taiteen ja kulttuurin pariin.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('home-cms-content-skeleton')
    ).not.toBeInTheDocument();
  });
});
