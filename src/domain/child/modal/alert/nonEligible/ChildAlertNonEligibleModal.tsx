import * as React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './childAlertNonEligibleModal.module.scss';
import Icon from '../../../../../common/components/icon/Icon';
import personIcon from '../../../../../assets/icons/svg/adultFace.svg';
import Button from '../../../../../common/components/button/Button';
interface ChildFormModalNonEligibleProps {
  setIsOpen: (value: boolean) => void;
}

// TODO: Make a modal
const ChildAlertNonEligibleModal: React.FunctionComponent<ChildFormModalNonEligibleProps> = ({
  setIsOpen,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <div className={styles.notEligible}>
        <h3>{t('registration.notEligible.title')}</h3>
        <p>{t('registration.notEligible.text')}</p>
        <Icon className={styles.icon} src={personIcon} />
        <Button
          className={styles.goBackButton}
          onClick={() => setIsOpen(false)}
        >
          {t('child.form.modal.notEligible.return.text')}
        </Button>
      </div>
    </div>
  );
};

export default ChildAlertNonEligibleModal;
