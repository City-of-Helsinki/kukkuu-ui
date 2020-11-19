import React from 'react';

import { render } from '../../../../common/test/testingLibraryUtils';
import ChildForm from '../ChildForm';

const defaultProps = {
  initialValues: {},
};
const getWrapper = (props) =>
  render(<ChildForm {...defaultProps} {...props} />);

describe('<ChildForm />', () => {
  describe('implementation details', () => {
    it('the form should have the noValidate prop so that browser validation is not used', () => {
      const { container } = getWrapper();

      expect(container.querySelector('#childForm').noValidate).toEqual(true);
    });
  });
});
