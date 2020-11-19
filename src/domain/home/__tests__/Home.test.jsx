import React from 'react';
import toJson from 'enzyme-to-json';
import * as ReactRedux from 'react-redux';

import { shallowWithProvider } from '../../../common/test/testUtils';
import { render } from '../../../common/test/testingLibraryUtils';
import Home from '../Home';

const getWrapper = () => render(<Home />);

describe('<Home />', () => {
  it('renders snapshot correctly', () => {
    const home = shallowWithProvider(<Home />);
    expect(toJson(home)).toMatchSnapshot();
  });

  it('does not show the link to the godchild profile if the user is no longer authenticated', () => {
    jest
      .spyOn(ReactRedux, 'useSelector')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const { queryByRole } = getWrapper();

    expect(
      queryByRole('button', { name: 'Oma kummilapsiprofiili' })
    ).toBeFalsy();
  });
});
