// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import AddNewChildFormModal from '../AddNewChildFormModal';
import * as NotEligibleUtils from '../../notEligible/NotEligibleUtils';
import { store } from '../../../app/state/AppStore';
import { setFormValues, resetFormValues } from '../../state/RegistrationActions';
import { RelationshipTypeEnum } from '../../../api/generatedTypes/graphql';

const prefillStore = (overrides = {}) => {
  store.dispatch(
    setFormValues({
      ...store.getState().registration.formValues,
      children: [
        {
          birthyear: new Date().getFullYear(),
          name: 'Test Child',
          homeCity: 'Helsinki',
          postalCode: '00100',
          relationship: { type: RelationshipTypeEnum.Parent },
          ...overrides,
        },
      ],
    })
  );
};

describe('AddNewChildFormModal', () => {
  beforeEach(() => {
    store.dispatch(resetFormValues());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const getAddButton = () =>
    screen.getByRole('button', { name: 'Lisää lapsi' });

  it('renders the form with the add label and form fields', () => {
    render(<AddNewChildFormModal addChild={vi.fn()} setIsOpen={vi.fn()} />, []);

    expect(screen.getByRole('heading', { name: 'Lisää lapsi' })).toBeInTheDocument();
    expect(getAddButton()).toBeInTheDocument();
    expect(screen.getByLabelText(/Lapsen nimi/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Lapsen kotipaikkakunta/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Postinumero/i)).toBeInTheDocument();
  });

  it('shows the non-eligible modal when an ineligible child is submitted', async () => {
    vi.spyOn(NotEligibleUtils, 'isChildEligible').mockReturnValue(false);
    prefillStore();
    const user = userEvent.setup();
    render(<AddNewChildFormModal addChild={vi.fn()} setIsOpen={vi.fn()} />, []);

    await user.click(getAddButton());

    expect(await screen.findByText('Voi harmi!')).toBeInTheDocument();
  });

  it('calls addChild and setIsOpen when an eligible child is submitted', async () => {
    vi.spyOn(NotEligibleUtils, 'isChildEligible').mockReturnValue(true);
    prefillStore();
    const addChild = vi.fn();
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    render(<AddNewChildFormModal addChild={addChild} setIsOpen={setIsOpen} />, []);

    await user.click(getAddButton());

    expect(addChild).toHaveBeenCalledTimes(1);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});

