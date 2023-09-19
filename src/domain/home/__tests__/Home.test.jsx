import * as ReactRedux from 'react-redux';

import { render, screen } from '../../../common/test/testingLibraryUtils';
import Home from '../Home';

describe('<Home />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it('does not show the link to the godchild profile if the user is no longer authenticated', () => {
    jest
      .spyOn(ReactRedux, 'useSelector')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    render(<Home />);
    expect(
      screen.queryByRole('button', { name: 'Oma kummilapsiprofiili' })
    ).toBeFalsy();
  });
});
