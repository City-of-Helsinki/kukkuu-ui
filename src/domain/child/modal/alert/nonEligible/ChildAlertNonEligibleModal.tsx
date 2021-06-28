import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './childAlertNonEligibleModal.module.scss';
import Icon from '../../../../../common/components/icon/Icon';
import personIcon from '../../../../../assets/icons/svg/adultFace.svg';
import AlertModal from '../../../../../common/components/alert/AlertModal';

interface ChildFormModalNonEligibleProps {
  setIsOpen: (value: boolean) => void;
}

const ChildAlertNonEligibleModal: FunctionComponent<ChildFormModalNonEligibleProps> =
  ({ setIsOpen }) => {
    const { t } = useTranslation();

    return (
      <AlertModal
        isOpen={true}
        heading={t('registration.notEligible.title')}
        ok={t('child.form.modal.notEligible.return.text')}
        onClose={() => setIsOpen(false)}
      >
        <p>{t('registration.notEligible.text')}</p> {/* TODO: wrong text */}
        <Icon className={styles.icon} src={personIcon} />
      </AlertModal>
    );
  };

export default ChildAlertNonEligibleModal;
