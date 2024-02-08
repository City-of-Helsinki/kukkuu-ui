import * as React from 'react';
import { Formik, FormikProps, FormikErrors, Form } from 'formik';
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
  UpdateMyProfileMutation,
  UpdateMyProfileMutationInput,
} from '../../api/generatedTypes/graphql';
import adultIcon from '../../../assets/icons/svg/adultFaceHappy.svg';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';
import FormikDropdown from '../../../common/components/formikWrappers/FormikDropdown';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import LanguagesCombobox from '../../languages/LanguagesCombobox';
import RelayList from '../../api/relayList';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  lastName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  email: yup
    .string()
    .email('registration.form.guardian.email.input.error')
    .required('validation.general.required'),
  phoneNumber: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  language: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
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
                id="email"
                name="email"
                required={true}
                label={t('registration.form.guardian.email.input.label')}
                placeholder={t(
                  'registration.form.guardian.email.input.placeholder'
                )}
              />
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
      </Modal>
    </div>
  );
};

export default EditProfileModal;
