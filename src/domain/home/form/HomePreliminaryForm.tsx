import React, { FunctionComponent } from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { loginTunnistamo } from '../../auth/authenticate';
import styles from './homePreliminaryForm.module.scss';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import { validateDate } from '../../../common/components/form/validationUtils';
import { isChildEligible } from '../../registration/notEligible/NotEligibleUtils';
import BirthdateFormField from './partial/BirthdateFormField';
import { setFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { StoreState } from '../../app/types/AppTypes';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import { HomeFormValues } from './types/HomeFormTypes';
import { convertFormValues } from './HomePreliminaryFormUtils';
import { newMoment, formatTime } from '../../../common/time/utils';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import { registrationFormDataSelector } from '../../registration/state/RegistrationSelectors';
interface Props {
  isAuthenticated: boolean;
  setFormValues: (values: RegistrationFormValues) => void;
  stateFormValues: RegistrationFormValues;
  initialValues: HomeFormValues;
}

const HomePreliminaryForm: FunctionComponent<Props> = ({
  setFormValues,
  stateFormValues,
  isAuthenticated,
  initialValues,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = (values: HomeFormValues) => {
    const payload = Object.assign({}, stateFormValues, {
      child: {
        // Ensure date that saved in redux store was using backend time format:
        birthdate: formatTime(
          newMoment(
            `${values.child.birthdate.year}-${values.child.birthdate.month}-${values.child.birthdate.day}`,
            'YYYY-MM-DD'
          )
        ),
        homeCity: values.child.homeCity,
        firstName: stateFormValues.child.firstName,
        lastName: stateFormValues.child.lastName,
      },
      verifyInformation: values.verifyInformation,
    });
    setFormValues(payload);
    handleRedirect(payload);
  };

  const handleRedirect = (payload: RegistrationFormValues) => {
    if (!isChildEligible(payload)) {
      history.push('/registration/not-eligible');
    } else if (isAuthenticated) {
      history.push('/registration/form');
    } else {
      loginTunnistamo(`/registration/form`);
    }
  };

  const validate = (values: HomeFormValues) => {
    const {
      child: {
        birthdate: { day, month, year },
      },
    } = values;
    const errors: FormikErrors<HomeFormValues> = {};

    if (day && month && year) {
      errors.childBirthdate = validateDate(`${day}.${month}.${year}`);

      if (!errors.childBirthdate) {
        // Delete the property manually so form will be valid when this is undefined.
        delete errors.childBirthdate;
      }
    }
    return errors;
  };

  return (
    <div className={styles.homeForm}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        // To not be able to submit form at first mount
        initialErrors={
          stateFormValues.child.birthdate
            ? {}
            : { childBirthdate: validateDate('') }
        }
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <FieldArray
                name="child.birthdate"
                render={props => <BirthdateFormField {...props} />}
              />

              <EnhancedInputField
                className={styles.childHomeCity}
                name="child.homeCity"
                label={t('homePage.preliminaryForm.childHomeCity.input.label')}
                required={true}
                component={InputField}
                placeholder={t(
                  'homePage.preliminaryForm.childHomeCity.input.placeholder'
                )}
              />
            </div>

            <EnhancedInputField
              className={styles.verifyInformationCheckbox}
              type="checkbox"
              label={t(
                'homePage.preliminaryForm.verifyInformation.checkbox.label'
              )}
              name="verifyInformation"
              required={true}
              component={InputField}
            />

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !isValid}
            >
              {t('homePage.hero.buttonText')}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

const actions = {
  setFormValues,
};

const mapStateToProps = (state: StoreState) => {
  const stateFormData = registrationFormDataSelector(state);
  return {
    isAuthenticated: isAuthenticatedSelector(state),
    stateFormValues: stateFormData,
    initialValues: convertFormValues(stateFormData),
  };
};

export const UnconnectedHomePreliminaryForm = HomePreliminaryForm;

export default connect(
  mapStateToProps,
  actions
)(HomePreliminaryForm);
