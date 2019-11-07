import { get } from 'lodash';

import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { newMoment } from '../../../common/time/utils';
import { HomeFormValues } from './types/FormTypes';

export const convertFormValues = (
  stateFormValues: RegistrationFormValues
): HomeFormValues => {
  if (get(stateFormValues, 'child.birthDay')) {
    const day = newMoment(stateFormValues.child.birthday, DEFAULT_DATE_FORMAT);
    return {
      child: {
        birthday: {
          day: day.date(),
          month: day.month() + 1,
          year: day.year(),
        },
        homeCity: stateFormValues.child.homeCity,
      },
      verifyInformation: stateFormValues.verifyInformation,
    };
  } else {
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
  }
};
