import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { HomeFormValues } from './types/HomeFormTypes';
import { getChildFormModalValues } from '../../child/ChildUtils';

/**
 * Convert FormValues fetched from state to initialValues used by formik
 * @param {RegistrationFormValues} stateFormValues Values from state.
 * @returns {HomeFormValues} initialValues used in form.
 */
export const convertFormValues = (
  stateFormValues: RegistrationFormValues
): HomeFormValues => {
  const child = getChildFormModalValues(stateFormValues.children[0]);

  return {
    child: {
      homeCity: child.homeCity,
      birthyear: child.birthyear,
    },
    verifyInformation: false,
  };
};
