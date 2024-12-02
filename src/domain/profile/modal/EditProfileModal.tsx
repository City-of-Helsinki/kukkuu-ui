import * as React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './editProfileModal.module.scss';
import { MyProfile } from '../types/ProfileQueryTypes';
import Modal from '../../../common/components/modal/Modal';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';
import EditMyProfileForm from './EditMyProfileForm';
import EditMyEmailForm from './EditMyEmailForm';

export interface EditProfileModalProps {
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
        icon={'/icons/svg/adultFaceHappy.svg'}
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

export default EditProfileModal;
