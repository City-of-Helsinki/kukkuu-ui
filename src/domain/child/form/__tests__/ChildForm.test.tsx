// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import ChildForm from '../ChildForm';
import { CHILD_FORM_TEST_ID } from '../constants';
import { ChildFormType } from '../../enums';

const defaultProps = {
  initialValues: {},
};
const renderChildForm = (props: Partial<Parameters<typeof ChildForm>[0]>) =>
  render(<ChildForm {...defaultProps} {...props} />);

describe('<ChildForm />', () => {
  it('as a user I do not want to see the city control when editing', () => {
    renderChildForm({
      formType: ChildFormType.EDIT,
    });

    expect(screen.queryByLabelText('Lapsen kotipaikkakunta')).toBeFalsy();
  });

  describe('implementation details', () => {
    it('the form should have the noValidate prop so that browser validation is not used', async () => {
      renderChildForm();

      expect(await screen.findByTestId(CHILD_FORM_TEST_ID)).toHaveAttribute(
        'noValidate'
      );
    });
  });
});
