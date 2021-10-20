import { render } from '../../../../common/test/testingLibraryUtils';
import ChildForm, { CHILD_FORM_TYPES } from '../ChildForm';

const defaultProps = {
  initialValues: {},
};
const getWrapper = (props) =>
  render(<ChildForm {...defaultProps} {...props} />);

describe('<ChildForm />', () => {
  it('as a user I do not want to see the city control when editing', () => {
    const { queryByLabelText } = getWrapper({
      formType: CHILD_FORM_TYPES.EDIT,
    });

    expect(queryByLabelText('Lapsen kotipaikkakunta')).toBeFalsy();
  });

  describe('implementation details', () => {
    it('the form should have the noValidate prop so that browser validation is not used', () => {
      const { container } = getWrapper();

      expect(container.querySelector('#childForm').noValidate).toEqual(true);
    });
  });
});
