import React, { FunctionComponent, useState } from 'react';
import { Formik, FieldArray } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useHistory, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import styles from './registrationForm.module.scss';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import submitChildrenAndGuardianMutation from '../mutations/submitChildrenAndGuardianMutation';
import { resetFormValues, setFormValues } from '../state/RegistrationActions';
import { initialFormDataSelector } from './RegistrationFormSelectors';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import ChildFormField from './partial/ChildFormField';
import AddNewChildFormModal from '../modal/AddNewChildFormModal';
import Icon from '../../../common/components/icon/Icon';
import addIcon from '../../../assets/icons/svg/delete.svg';
import happyAdultIcon from '../../../assets/icons/svg/adultFaceHappy.svg';
import PageWrapper from '../../app/layout/PageWrapper';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { getSupportedChildData } from '../../child/ChildUtils';
// eslint-disable-next-line max-len
import { submitChildrenAndGuardian as SubmitChildrenAndGuardianData } from '../../api/generatedTypes/submitChildrenAndGuardian';
import { saveProfile, clearProfile } from '../../profile/state/ProfileActions';
import profileQuery from '../../profile/queries/ProfileQuery';
import { profileQuery as ProfileQueryType } from '../../api/generatedTypes/profileQuery';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';

const RegistrationForm: FunctionComponent = () => {
  const { i18n, t } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = useSelector(initialFormDataSelector);
  const { loading, error, data } = useQuery<ProfileQueryType>(profileQuery);
  const [submitChildrenAndGuardian] = useMutation<
    SubmitChildrenAndGuardianData
  >(submitChildrenAndGuardianMutation, {
    refetchQueries: [{ query: profileQuery }],
  });
  // For new users preferLanguage defaults to their chosen UI language.
  initialValues.preferLanguage = initialValues.preferLanguage || currentLocale;

  // isFilling is true when user has started filling out the form.
  // They will lose all their local form state if they change URL
  // or reload the page unless they submit first.
  const [isFilling, setFormIsFilling] = useState(false);

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (!data || error) {
    dispatch(clearProfile());
  }
  if (data?.myProfile) {
    // No need to save profile here, that will be done after the redirect
    return <Redirect to="/profile" />;
  }

  return (
    <PageWrapper
      className={styles.grayBackground}
      title={'registration.heading'}
    >
      <NavigationConfirm
        isHalfFilling={isFilling}
        warningMessage={t('common.form.leave.warning.text')}
      />

      <div className={styles.registrationFormContainer}>
        <div className={styles.registrationForm}>
          <Formik
            initialValues={initialValues}
            validate={() => {
              if (!isFilling) {
                setFormIsFilling(true);
              }
            }}
            onSubmit={(values) => {
              setFormIsFilling(false);
              dispatch(setFormValues(values));

              const backendSupportChildren = values.children.map((child) =>
                getSupportedChildData(child)
              );

              const backendSupportGuardian = {
                firstName: values.guardian.firstName,
                lastName: values.guardian.lastName,
                phoneNumber: values.guardian.phoneNumber,
                language: values.preferLanguage.toUpperCase(), // Uppercase to support backend's use of Enum
              };

              submitChildrenAndGuardian({
                variables: {
                  children: backendSupportChildren,
                  guardian: backendSupportGuardian,
                },
              })
                .then((response) => {
                  if (response.data?.submitChildrenAndGuardian?.guardian) {
                    dispatch(
                      saveProfile(
                        response.data?.submitChildrenAndGuardian?.guardian
                      )
                    );
                  }
                  dispatch(resetFormValues());
                  history.push('/registration/success');
                })
                .catch((error) => {
                  toast(t('registration.submitMutation.errorMessage'), {
                    type: toast.TYPE.ERROR,
                  });
                  Sentry.captureException(error);
                });
            }}
          >
            {({ values, isSubmitting, handleSubmit }) => (
              <form onSubmit={handleSubmit} id="registrationForm">
                <div className={styles.registrationGrayContainer}>
                  <h1>{t('registration.heading')}</h1>
                </div>

                <div
                  className={classnames(
                    styles.childrenInfo,
                    styles.registrationWhiteContainer
                  )}
                >
                  <FieldArray
                    name="children"
                    render={(arrayHelpers) => {
                      return (
                        <>
                          {isOpen && (
                            <AddNewChildFormModal
                              setIsOpen={setIsOpen}
                              addChild={(payload) => {
                                // When user add child first instead of other input
                                // validate wont be invoked -> isFilling still false but
                                // user do have unfinished work
                                // this function was invoked here to make sure in that case
                                setFormIsFilling(true);
                                arrayHelpers.push(payload);
                              }}
                            />
                          )}
                          {values.children &&
                            values.children.map((child, index) => (
                              <ChildFormField
                                key={index}
                                arrayHelpers={arrayHelpers}
                                child={child}
                                childIndex={index}
                              />
                            ))}
                        </>
                      );
                    }}
                  />
                </div>
                <div className={styles.registrationGrayContainer}>
                  <Button
                    aria-label={t('child.form.modal.add.label')}
                    className={styles.addNewChildButton}
                    onClick={() => setIsOpen(true)}
                  >
                    <Icon className={styles.plusIcon} src={addIcon} />
                    {t('child.form.modal.add.label')}
                  </Button>
                </div>
                <div
                  className={classnames(
                    styles.guardianInfo,
                    styles.registrationWhiteContainer
                  )}
                >
                  <div className={styles.heading}>
                    <Icon src={happyAdultIcon} className={styles.childImage} />
                    <h2>{t('registration.form.guardian.info.heading')}</h2>
                  </div>
                  <div className={styles.guardianEmail}>
                    <label>
                      {t('registration.form.guardian.email.input.label')}
                    </label>
                    <p>{values.guardian.email}</p>
                  </div>

                  <EnhancedInputField
                    id="guardian.phoneNumber"
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
                      id="guardian.firstName"
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
                      id="guardian.lastName"
                      name="guardian.lastName"
                      label={t(
                        'registration.form.guardian.lastName.input.label'
                      )}
                      component={InputField}
                      placeholder={t(
                        'registration.form.guardian.lastName.input.placeholder'
                      )}
                    />
                  </div>

                  <EnhancedInputField
                    value={values.preferLanguage}
                    id="preferLanguage"
                    name="preferLanguage"
                    label={t('registration.form.guardian.language.input.label')}
                    required={true}
                    component={SelectField}
                    options={[
                      {
                        label: t('common.language.en'),
                        value: SUPPORT_LANGUAGES.EN,
                      },
                      {
                        label: t('common.language.fi'),
                        value: SUPPORT_LANGUAGES.FI,
                      },
                      {
                        label: t('common.language.sv'),
                        value: SUPPORT_LANGUAGES.SV,
                      },
                    ]}
                    placeholder={t(
                      'registration.form.guardian.language.input.placeholder'
                    )}
                  />
                  <EnhancedInputField
                    className={styles.agreeBtn}
                    type="checkbox"
                    id="agree"
                    name="agree"
                    required={true}
                    label={t('registration.form.agree.input.label')}
                    component={InputField}
                  />

                  <Button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {t('homePage.hero.buttonText')}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RegistrationForm;
