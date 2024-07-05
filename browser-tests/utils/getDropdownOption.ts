import { screen } from '@testing-library/testcafe';

/**
 *
 * @param label label of the option that should be selected
 * @param useGetAllByRoleFix a bubblegum fix for comboboxes that sometimes have same value many times
 * @returns Option
 */
function getDropdownOption(label: string, useGetAllByRoleFix = false) {
  if (useGetAllByRoleFix) {
    return screen.getAllByRole('option', { name: label })[0];
  }
  return screen.getByRole('option', { name: label });
}

export default getDropdownOption;
