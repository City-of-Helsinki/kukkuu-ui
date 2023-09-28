import * as ReactRedux from 'react-redux';

import { render, screen } from '../../../common/test/testingLibraryUtils';
import Home from '../Home';

vi.mock('react-redux', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
  }
})

describe('<Home />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it('does not show the link to the godchild profile if the user is no longer authenticated', () => {
    vi
      .spyOn(ReactRedux, 'useSelector')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    render(<Home />);
    expect(
      screen.queryByRole('button', { name: 'Oma kummilapsiprofiili' })
    ).toBeFalsy();
  });
});
