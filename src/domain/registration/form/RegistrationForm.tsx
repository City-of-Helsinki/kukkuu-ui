import React, { FunctionComponent } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import styles from './registrationForm.module.scss';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import submitChildrenAndGuardianMutation from '../mutations/submitChildrenAndGuardianMutation';
import { setFormValues } from '../state/RegistrationActions';
import { RegistrationFormValues } from '../types/RegistrationTypes';
import { StoreState } from '../../app/types/AppTypes';
import { userSelector } from '../../auth/state/AuthenticationSelectors';
import { initialFormDataSelector } from './RegistrationFormSelectors';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import { formatTime, newMoment } from '../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import { validateRequire } from '../../../common/components/form/validationUtils';

interface Props {
  setFormValues: (values: RegistrationFormValues) => void;
  initialValues: RegistrationFormValues;
}

const RegistrationForm: FunctionComponent<Props> = ({
  setFormValues,
  initialValues,
}) => {
  // TODO: Do something with the data we get from the backend.
  const [submitChildrenAndGuardian] = useMutation(
    submitChildrenAndGuardianMutation
  );
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className={styles.registrationFormContainer}>
      <div className={styles.registrationForm}>
        <Formik
          initialValues={initialValues}
          initialErrors={
            (!initialValues.agree && {
              agree: validateRequire(''),
            }) ||
            {}
          }
          onSubmit={values => {
            setFormValues(values);
            const childInput = [
              {
                birthdate: values.child.birthdate,
                firstName: values.child.firstName,
                lastName: values.child.lastName,
              },
            ];
            try {
              submitChildrenAndGuardian({
                variables: {
                  children: childInput,
                  guardianFirstName: values.guardian.firstName,
                  guardianLastName: values.guardian.lastName,
                  email: values.guardian.email,
                },
              });
              history.push('/registration/success');
            } catch (err) {
              // TODO: Error handling.
              // eslint-disable-next-line no-console
              console.error(err);
            }
          }}
        >
          {({ values, isSubmitting, handleSubmit, isValid, errors }) => (
            <form onSubmit={handleSubmit}>
              <h1>{t('registration.heading')}</h1>
              <div className={styles.childInfo}>
                <h2>{t('registration.form.child.info.heading')}</h2>
                <div className={styles.childBirthdate}>
                  <label>
                    {t('registration.form.child.birthdate.input.label')}
                  </label>
                  <p>
                    {formatTime(
                      newMoment(values.child.birthdate),
                      DEFAULT_DATE_FORMAT
                    )}
                  </p>
                </div>

                <div className={styles.childName}>
                  <EnhancedInputField
                    name="child.firstName"
                    label={t('registration.form.child.firstName.input.label')}
                    component={InputField}
                    placeholder={t(
                      'registration.form.child.firstName.input.placeholder'
                    )}
                  />
                  <EnhancedInputField
                    name="child.lastName"
                    label={t('registration.form.child.lastName.input.label')}
                    component={InputField}
                    placeholder={t(
                      'registration.form.child.lastName.input.placeholder'
                    )}
                  />
                </div>

                <EnhancedInputField
                  name="child.postalCode"
                  type="number"
                  label={t('registration.form.child.postalCode.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.child.postalCode.input.placeholder'
                  )}
                />

                <EnhancedInputField
                  name="child.relationship"
                  label={t('registration.form.child.relationship.input.label')}
                  component={SelectField}
                  id="registration.form.child.relationship.select"
                  options={[
                    { label: 'Parents', value: 'parents' },
                    { label: 'Spouse', value: 'spouse' },
                  ]}
                  placeholder={t(
                    'registration.form.child.relationship.input.placeholder'
                  )}
                />
              </div>

              <div className={styles.guardianInfo}>
                <h2>{t('registration.form.guardian.info.heading')}</h2>
                <div className={styles.guardianEmail}>
                  <label>
                    {t('registration.form.guardian.email.input.label')}
                  </label>
                  <p>{values.guardian.email}</p>
                </div>

                <EnhancedInputField
                  name="guardian.phoneNumber"
                  required={true}
                  label={t(
                    'registration.form.guardian.phoneNumber.input.label'
                  )}
                  component={InputField}
                  placeholder={t(
                    'registration.form.guardian.phoneNumber.input.placeholder'
                  )}
                />
                <div className={styles.guardianName}>
                  <EnhancedInputField
                    type="text"
                    required={true}
                    name="guardian.firstName"
                    label={t(
                      'registration.form.guardian.firstName.input.label'
                    )}
                    component={InputField}
                    placeholder={t(
                      'registration.form.guardian.firstName.input.placeholder'
                    )}
                  />
                  <EnhancedInputField
                    type="text"
                    required={true}
                    name="guardian.lastName"
                    label={t('registration.form.guardian.lastName.input.label')}
                    component={InputField}
                    placeholder={t(
                      'registration.form.guardian.lastName.input.placeholder'
                    )}
                  />
                </div>

                <EnhancedInputField
                  name="preferLanguage"
                  label={t('registration.form.guardian.language.input.label')}
                  required={true}
                  component={SelectField}
                  options={[
                    { label: 'English', value: SUPPORT_LANGUAGES.EN },
                    { label: 'Suomi', value: SUPPORT_LANGUAGES.FI },
                    { label: 'Svenska', value: SUPPORT_LANGUAGES.SV },
                  ]}
                  placeholder={t(
                    'registration.form.guardian.language.input.placeholder'
                  )}
                />
                <EnhancedInputField
                  className={styles.agreeBtn}
                  type="checkbox"
                  name="agree"
                  required={true}
                  label={t('registration.form.agree.input.label')}
                  component={InputField}
                />
              </div>

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
    </div>
  );
};

const actions = {
  setFormValues,
};

const mapStateToProps = (state: StoreState) => ({
  initialValues: initialFormDataSelector(state),
  tunnistamoUserValues: userSelector(state),
});

export const UnconnectedRegistrationForm = RegistrationForm;

export default connect(
  mapStateToProps,
  actions
)(RegistrationForm);
