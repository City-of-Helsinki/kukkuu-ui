// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import ChildForm from '../ChildForm';
import { CHILD_FORM_TEST_ID } from '../constants';
import { ChildFormType } from '../../enums';
import { themePathsQuery } from '../../../event/queries/themePathsQuery';
import { fakeThemePath } from '../../../../utils/eventMockDataUtils';

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

  it('renders birthyear as readOnly and places Save before Cancel when editing', () => {
    renderChildForm({
      formType: ChildFormType.EDIT,
      initialValues: {
        birthyear: 2022,
        homeCity: 'Helsinki',
        postalCode: '00100',
        name: 'Muksu',
        relationship: { type: 'PARENT' },
      },
    });

    const birthyearInput = screen.getByLabelText(/lapsen syntymävuosi/i);
    expect(birthyearInput).toHaveAttribute('readonly');

    const saveButton = screen.getByRole('button', { name: 'Tallenna' });
    const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
    expect(
      saveButton.compareDocumentPosition(cancelButton) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    // Delete button should remain supplementary (not a primary button)
    const deleteButton = screen.getByRole('button', {
      name: /poista lapsen tiedot/i,
    });
    expect(deleteButton.className).toMatch(/supplementary/i);
  });


  it('submits selected themePathId when user picks a Teemapolku option', async () => {
    const user = userEvent.setup();
    const themePath = fakeThemePath({ slug: 'story', name: 'Tarina' });
    const onSubmit = vi.fn();
    const themePathsMock = {
      request: { query: themePathsQuery },
      result: {
        data: {
          themePaths: {
            edges: [{ node: themePath }],
          },
        },
      },
    };

    render(
      <ChildForm
        initialValues={{
          birthyear: 2022,
          homeCity: 'Helsinki',
          postalCode: '00100',
          name: 'Eveliina',
          themePathId: '',
          relationship: { type: 'PARENT' },
        }}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        setFormIsFilling={vi.fn()}
        formType={ChildFormType.EDIT}
      />,
      [themePathsMock]
    );

    const themePathToggle = screen.getByRole('combobox', {
      name: /teemapolku/i,
    });
    await user.click(themePathToggle);
    const option = await screen.findByRole('option', { name: themePath.name });
    await user.click(option);

    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          themePathId: themePath.id,
        })
      );
    });
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
