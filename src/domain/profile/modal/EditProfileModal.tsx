import * as React from 'react';
import { Formik, FormikProps, FormikErrors, Form, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import * as yup from 'yup';

import styles from './editProfileModal.module.scss';
import {
  MyProfile,
  LanguagesSpokenAtHomeNode,
} from '../types/ProfileQueryTypes';
import Modal from '../../../common/components/modal/Modal';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import profileQuery from '../queries/ProfileQuery';
import updateMyProfileMutation from '../mutations/updateMyProfileMutation';
import {
  UpdateMyEmailMutationDocument,
  type RequestEmailUpdateTokenMutation,
  type UpdateMyEmailMutation,
  type UpdateMyProfileMutation,
  type UpdateMyProfileMutationInput,
  UpdateMyEmailMutationInput,
} from '../../api/generatedTypes/graphql';
import adultIcon from '../../../assets/icons/svg/adultFaceHappy.svg';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';
import FormikDropdown from '../../../common/components/formikWrappers/FormikDropdown';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import LanguagesCombobox from '../../languages/LanguagesCombobox';
import RelayList from '../../api/relayList';
import requestEmailUpdateTokenMutation from '../mutations/requestEmailUpdateTokenMutation';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  lastName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  phoneNumber: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  language: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
});

const emailChangeSchema = yup.object().shape({
  email: yup
    .string()
    .email('registration.form.guardian.email.input.error')
    .required('validation.general.required'),
  verificationToken: yup
    .string()
    .required('validation.general.required')
    .max(20, 'validation.maxLength'),
});

const LanguagesSpokenAtHome = RelayList<LanguagesSpokenAtHomeNode>();

function getInitialValues({
  languagesSpokenAtHome,
  ...rest
}: MyProfile): UpdateMyProfileMutationInput {
  return {
    ...rest,
    languagesSpokenAtHome: LanguagesSpokenAtHome(
      languagesSpokenAtHome
    ).items.map((language) => language.id),
  };
}

interface EditProfileModalProps {
  initialValues: MyProfile;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({
  initialValues,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  const [isFilling, setFormIsFilling] = React.useState(false);

  return (
    <div>
      {isOpen && (
        <NavigationConfirm
          warningMessage={t('common.form.leave.warning.text')}
          isHalfFilling={isFilling}
        />
      )}
      <Modal
        setFormIsFilling={setFormIsFilling}
        label={t('registration.form.guardian.info.heading')}
        isOpen={isOpen}
        icon={adultIcon}
        toggleModal={(value: boolean) => {
          setIsOpen(value);
        }}
      >
        <EditMyEmailForm initialValues={initialValues} />
        <hr className={styles.separator} />
        <EditMyProfileForm
          initialValues={initialValues}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </div>
  );
};

function EditMyEmailForm({
  initialValues: { email: originalEmail },
}: Pick<EditProfileModalProps, 'initialValues'>) {
  const { t } = useTranslation();

  const [isChangingEmail, setIsChangingEmail] = React.useState(false);
  const [updateMyEmail] = useMutation<UpdateMyEmailMutation>(
    UpdateMyEmailMutationDocument
  );

  const onSubmit = async (
    { email, verificationToken }: UpdateMyEmailMutationInput,
    { setFieldValue, setFieldError }: FormikHelpers<UpdateMyEmailMutationInput>
  ) => {
    try {
      await updateMyEmail({
        variables: {
          input: {
            email,
            verificationToken,
          },
        },
      });
      setIsChangingEmail(false);
      setFieldValue('verificationToken', '');
      toast.success(t('registration.submitMutation.successfulMessage'));
    } catch (error: any) {
      if (error.message.includes('token is invalid')) {
        setFieldError(
          'verificationToken',
          t('registration.form.guardian.email.verificationToken.errors.invalid')
        );
        toast.error(t('registration.form.guardian.email.errors.unsuccessful'));
      } else {
        toast.error(t('registration.submitMutation.errorMessage'));
        Sentry.captureException(error);
      }
    }
  };

  const validate = ({ email }: UpdateMyEmailMutationInput) => {
    if (!isChangingEmail) {
      setIsChangingEmail(true);
    }

    const errors: FormikErrors<UpdateMyEmailMutationInput> = {};

    if (email === originalEmail) {
      return {
        ...errors,
        email: 'registration.form.guardian.email.input.notChanged',
      };
    }
    return errors;
  };

  // Focus on email field when the email changing form is opened
  React.useEffect(() => {
    if (isChangingEmail) {
      (document.querySelector(`#email`) as HTMLInputElement)?.focus();
    }
  }, [isChangingEmail]);

  return (
    <Formik
      initialValues={{
        email: originalEmail,
        verificationToken: '',
      }}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={emailChangeSchema}
    >
      {({ isSubmitting }: FormikProps<UpdateMyEmailMutationInput>) => (
        <Form>
          <FormikTextInput
            className={styles.formField}
            id="email"
            name="email"
            disabled={!isChangingEmail}
            label={t('registration.form.guardian.email.input.label')}
          />
          {!isChangingEmail && (
            <Button
              className={styles.emailChangeButton}
              variant="supplementary"
              onClick={() => {
                setIsChangingEmail(true);
              }}
            >
              {t('registration.form.guardian.email.change.button')}
            </Button>
          )}
          {isChangingEmail && (
            <>
              <div className={styles.emailVerificationTokenFieldWrapper}>
                <FormikTextInput
                  className={styles.formField}
                  id="verificationToken"
                  name="verificationToken"
                  label={t(
                    'registration.form.guardian.email.verificationToken.input.label'
                  )}
                  placeholder={t(
                    'registration.form.guardian.email.verificationToken.input.placeholder'
                  )}
                  helperText={t(
                    'registration.form.guardian.email.verificationToken.input.helper'
                  )}
                  autoComplete="off"
                />
                <RequestVerificationTokenButton />
              </div>

              <div className={styles.buttonsWrapper}>
                <Button
                  onClick={() => setIsChangingEmail(false)}
                  variant="secondary"
                  type="button"
                  className={styles.cancelButton}
                >
                  {t('common.modal.cancel.text')}
                </Button>

                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {t('common.modal.save.textWithSubject', {
                    subject: t('registration.form.guardian.email.input.label'),
                  })}
                </Button>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}

function EditMyProfileForm({
  initialValues,
  setIsOpen,
}: Pick<EditProfileModalProps, 'initialValues' | 'setIsOpen'>) {
  const { t } = useTranslation();
  const { trackEvent } = useMatomo();
  const [isFilling, setFormIsFilling] = React.useState(false);
  const [updateMyProfile] = useMutation<UpdateMyProfileMutation>(
    updateMyProfileMutation,
    {
      refetchQueries: [{ query: profileQuery }],
    }
  );

  const onSubmit = async (payload: UpdateMyProfileMutationInput) => {
    setFormIsFilling(false);
    try {
      await updateMyProfile({
        variables: {
          input: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            language: payload.language,
            languagesSpokenAtHome: payload.languagesSpokenAtHome,
          },
        },
      });

      trackEvent({ category: 'action', action: 'Edit profile' });
      setIsOpen(false);
    } catch (error) {
      toast.error(t('registration.submitMutation.errorMessage'));
      Sentry.captureException(error);
    }
  };

  const validate = () => {
    if (!isFilling) {
      setFormIsFilling(true);
    }

    const errors: FormikErrors<UpdateMyProfileMutationInput> = {};
    return errors;
  };

  return (
    <Formik
      initialValues={getInitialValues(initialValues)}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={schema}
    >
      {({ isSubmitting }: FormikProps<UpdateMyProfileMutationInput>) => (
        <Form id="editProfileForm">
          <FormikTextInput
            className={styles.formField}
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            minLength={5}
            maxLength={255}
            required={true}
            label={t('registration.form.guardian.phoneNumber.input.label')}
            placeholder={t(
              'registration.form.guardian.phoneNumber.input.placeholder'
            )}
          />
          <div className={styles.profileName}>
            <FormikTextInput
              className={styles.formField}
              type="text"
              required={true}
              id="firstName"
              name="firstName"
              label={t('registration.form.guardian.firstName.input.label')}
              placeholder={t(
                'registration.form.guardian.firstName.input.placeholder'
              )}
            />
            <FormikTextInput
              className={styles.formField}
              type="text"
              required={true}
              id="lastName"
              name="lastName"
              label={t('registration.form.guardian.lastName.input.label')}
              placeholder={t(
                'registration.form.guardian.lastName.input.placeholder'
              )}
            />
          </div>
          <FormikDropdown
            className={styles.formField}
            id="language"
            name="language"
            label={t('registration.form.guardian.language.input.label')}
            required={true}
            options={[
              {
                label: t('common.language.en'),
                value: SUPPORT_LANGUAGES.EN.toUpperCase(),
              },
              {
                label: t('common.language.fi'),
                value: SUPPORT_LANGUAGES.FI.toUpperCase(),
              },
              {
                label: t('common.language.sv'),
                value: SUPPORT_LANGUAGES.SV.toUpperCase(),
              },
            ]}
            placeholder={t(
              'registration.form.guardian.language.input.placeholder'
            )}
          />
          <LanguagesCombobox
            helper={t(
              'registration.form.child.languagesSpokenAtHome.input.helper'
            )}
            id="languagesSpokenAtHome"
            label={t(
              'registration.form.child.languagesSpokenAtHome.input.label'
            )}
            name="languagesSpokenAtHome"
            // Block escape from closing the modal
            catchEscapeKey
          />
          <div className={styles.buttonsWrapper}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant="secondary"
              type="button"
              className={styles.cancelButton}
            >
              {t('common.modal.cancel.text')}
            </Button>

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {t('common.modal.save.text')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function RequestVerificationTokenButton() {
  const { t } = useTranslation();
  const [requestUpdateEmailVerificationToken, { loading }] =
    useMutation<RequestEmailUpdateTokenMutation>(
      requestEmailUpdateTokenMutation
    );

  const { seconds: coolDownSeconds, reset: resetCoolDown } = useCoolDown(
    60,
    false
  );

  const isDisabled = Boolean(loading || coolDownSeconds);

  const handleOnClick = async () => {
    try {
      await requestUpdateEmailVerificationToken();
      resetCoolDown();
      toast.success(
        t(
          'registration.form.guardian.email.verificationToken.request.successful'
        )
      );
    } catch (error) {
      toast.error(
        t('registration.form.guardian.email.verificationToken.request.error')
      );
      Sentry.captureException(error);
    }
  };

  return (
    <LoadingSpinner isLoading={loading}>
      <Button
        variant="supplementary"
        onClick={handleOnClick}
        className={styles.requestVerificationTokenButton}
        disabled={isDisabled}
      >
        {coolDownSeconds
          ? coolDownSeconds
          : t(
              'registration.form.guardian.email.verificationToken.request.button'
            )}
      </Button>
    </LoadingSpinner>
  );
}

function useCoolDown(timerSeconds: number, start = false) {
  const [coolDownSeconds, setCoolDownSeconds] = React.useState(
    start ? timerSeconds : 0
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (coolDownSeconds > 0) {
        setCoolDownSeconds(coolDownSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [coolDownSeconds]);

  const resetCoolDown = () => {
    setCoolDownSeconds(timerSeconds);
  };

  return { seconds: coolDownSeconds, setCoolDownSeconds, reset: resetCoolDown };
}

export default EditProfileModal;
