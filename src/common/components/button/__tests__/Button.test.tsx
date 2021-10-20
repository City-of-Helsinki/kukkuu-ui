import { shallow } from 'enzyme';

import Button from '../Button';

it('renders snapshot correctly', () => {
  const button = shallow(<Button>foo</Button>);
  expect(button.html()).toMatchSnapshot();
});
