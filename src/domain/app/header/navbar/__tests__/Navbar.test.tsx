import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Navbar from '../Navbar';

describe('Navbar', () => {
  test('render normally', () => {
    const wrapper = shallow(<Navbar />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
