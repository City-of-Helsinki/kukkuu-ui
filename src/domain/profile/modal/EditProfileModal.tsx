import * as React from 'react';
import { Formik, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import styles from './editProfileModal.module.scss';
import { ProfileType } from '../type/ProfileTypes';
import { Guardian } from '../../guardian/types/GuardianTypes';
import Modal from '../../../common/components/modal/Modal';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../common/components/form/fields/input/InputField';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import Button from '../../../common/components/button/Button';
import profileQuery from '../queries/ProfileQuery';
import updateMyProfileMutation from '../mutations/updateMyProfileMutation';
import { updateMyProfile as UpdateMyProfileData } from '../../api/generatedTypes/updateMyProfile';
export type EditProfileModalValues = Omit<ProfileType, 'children'>;

interface EditProfileModalProps {
  initialValues: ProfileType;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({
  initialValues,
  isOpen,
  setIsOpen,
}) => {
  const [isFilling, setFormIsFilling] = React.useState(false);
  const [updateMyProfile] = useMutation<UpdateMyProfileData>(
    updateMyProfileMutation,
    {
      refetchQueries: [{ query: profileQuery }],
    }
  );

  const onSubmit = async (payload: Guardian) => {
    setFormIsFilling(false);
    try {
      await updateMyProfile({
        variables: {
          input: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            language: payload.language,
          },
        },
      });
      setIsOpen(false);
    } catch (error) {
      toast(t('registration.submitMutation.errorMessage'), {
        type: toast.TYPE.ERROR,
      });
      Sentry.captureException(error);
    }
  };

  const validate = () => {
    const errors: FormikErrors<EditProfileModalValues> = {};
    return errors;
  };

  const { t } = useTranslation();

  return (
    <div>
      <Modal
        setFormIsFilling={setFormIsFilling}
        label={t('registration.form.guardian.info.heading')}
        isOpen={isOpen}
        toggleModal={(value: boolean) => {
          setIsOpen(value);
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
        >
          {({ isSubmitting, handleSubmit }) => (
            <form onSubmit={handleSubmit} id="editProfileForm">
              <div className={styles.email}>
                <label>
                  {t('registration.form.guardian.email.input.label')}
                </label>
                <p className={styles.email}>{initialValues.email}</p>
              </div>
              <EnhancedInputField
                id="phoneNumber"
                name="phoneNumber"
                required={true}
                label={t('registration.form.guardian.phoneNumber.input.label')}
                component={InputField}
                placeholder={t(
                  'registration.form.guardian.phoneNumber.input.placeholder'
                )}
              />
              <div className={styles.profileName}>
                <EnhancedInputField
                  type="text"
                  required={true}
                  id="firstName"
                  name="firstName"
                  label={t('registration.form.guardian.firstName.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.guardian.firstName.input.placeholder'
                  )}
                />
                <EnhancedInputField
                  type="text"
                  required={true}
                  id="lastName"
                  name="lastName"
                  label={t('registration.form.guardian.lastName.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.guardian.lastName.input.placeholder'
                  )}
                />
              </div>
              <EnhancedInputField
                id="preferLanguage"
                name="language"
                label={t('registration.form.guardian.language.input.label')}
                required={true}
                component={SelectField}
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
              <div className={styles.buttonsWrapper}>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
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
                  {t('homePage.hero.buttonText')}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default EditProfileModal;
