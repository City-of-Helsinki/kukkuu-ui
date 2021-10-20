import { shallow } from 'enzyme';

import LoadingSpinner from '../LoadingSpinner';

it('renders snapshot correctly', () => {
  const spinner = shallow(<LoadingSpinner isLoading={false} />);
  expect(spinner.html()).toMatchSnapshot();
});

it('render spinner if isLoading is true', () => {
  const spinner = shallow(<LoadingSpinner isLoading={true} />).children();
  expect(spinner.prop('className')).toContain('spinner');
});

it('render child component if isLoading is false', () => {
  const spinner = shallow(
    <LoadingSpinner isLoading={false}>
      <div className="component"></div>
    </LoadingSpinner>
  ).children();
  expect(spinner.prop('className')).toEqual('component');
});
