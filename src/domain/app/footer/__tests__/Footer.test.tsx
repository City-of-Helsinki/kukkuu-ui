import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '../Footer';

it('renders snapshot correctly', () => {
  const footer = shallow(
    <Router>
      <Footer />
    </Router>
  );
  expect(footer.html()).toMatchSnapshot();
});
