import { get } from 'lodash';

import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { newMoment } from '../../../common/time/utils';
import { HomeFormTypes } from './types/FormTypes';

/**
 * Convert FormValues fetched from state to initialValues used by formi
 * @param {RegistrationFormValues} stateFormValues Values from state.
 * @returns {HomeFormTypes} initialValues used in form.
 */
export const convertFormValues = (
  stateFormValues: RegistrationFormValues
): HomeFormTypes => {
  if (get(stateFormValues, 'child.birthDay')) {
    const birthdayMoment = newMoment(
      stateFormValues.child.birthday,
      DEFAULT_DATE_FORMAT
    );
    return {
      child: {
        birthday: {
          day: birthdayMoment.date(),
          month: birthdayMoment.month() + 1,
          year: birthdayMoment.year(),
        },
        homeCity: stateFormValues.child.homeCity,
      },
      verifyInformation: stateFormValues.verifyInformation,
    };
  }
  return {
    child: {
      birthday: {
        day: '',
        month: '',
        year: '',
      },
      homeCity: '',
    },
    verifyInformation: false,
  };
};
