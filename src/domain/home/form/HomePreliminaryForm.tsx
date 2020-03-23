import React, { FunctionComponent, Ref } from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { loginTunnistamo } from '../../auth/authenticate';
import styles from './homePreliminaryForm.module.scss';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import { validateDate } from '../../../common/components/form/validationUtils';
import { isChildEligible } from '../../registration/notEligible/NotEligibleUtils';
import BirthdateFormField from './partial/BirthdateFormField';
import { setHomeFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { StoreState } from '../../app/types/AppTypes';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import { HomeFormValues, HomeFormPayload } from './types/HomeFormTypes';
import { convertFormValues } from './HomePreliminaryFormUtils';
import { newMoment, formatTime } from '../../../common/time/utils';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import { registrationFormDataSelector } from '../../registration/state/RegistrationSelectors';
import { BACKEND_DATE_FORMAT } from '../../../common/time/TimeConstants';
interface Props {
  isAuthenticated: boolean;
  setHomeFormValues: (values: HomeFormPayload) => void;
  stateFormValues: RegistrationFormValues;
  initialValues: HomeFormValues;
  forwardRef: Ref<HTMLDivElement>;
}

const HomePreliminaryForm: FunctionComponent<Props> = ({
  setHomeFormValues,
  isAuthenticated,
  initialValues,
  forwardRef,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = (values: HomeFormValues) => {
    const payload: HomeFormPayload = {
      child: {
        birthdate: formatTime(
          newMoment(
            `${values.child.birthdate.year}-${values.child.birthdate.month}-${values.child.birthdate.day}`,
            BACKEND_DATE_FORMAT
          )
        ),
        homeCity: values.child.homeCity,
      },
      verifyInformation: values.verifyInformation,
    };
    setHomeFormValues(payload);
    handleRedirect(payload);
  };

  const handleRedirect = (payload: HomeFormPayload) => {
    if (!isChildEligible(payload.child)) {
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
    <section className={styles.wrapper} ref={forwardRef}>
      <div className={styles.homeForm}>
        <div className={styles.heading}>
          <h2>{t('registration.heading')}</h2>
          <p>
            <Trans i18nKey="multiline">{t('home.registration.text')}</Trans>
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {({ handleSubmit, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit} id="homePageForm">
                <div className={styles.inputWrapper}>
                  <FieldArray
                    name="child.birthdate"
                    render={(props) => <BirthdateFormField {...props} />}
                  />

                  <EnhancedInputField
                    className={styles.childHomeCity}
                    name="child.homeCity"
                    aria-label={t(
                      'homePage.preliminaryForm.childHomeCity.input.label'
                    )}
                    label={t(
                      'homePage.preliminaryForm.childHomeCity.input.label'
                    )}
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
                  disabled={isSubmitting}
                >
                  {t('homePage.hero.buttonText')}
                </Button>
              </form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};

const actions = {
  setHomeFormValues,
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

export default connect(mapStateToProps, actions)(HomePreliminaryForm);
