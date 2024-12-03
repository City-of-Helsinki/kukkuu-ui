import { FunctionComponent } from 'react';

import Modal from '../modal/Modal';
import styles from './alertModal.module.scss';
import Button from '../button/Button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  ok: string;
  children?: React.ReactNode;
}

const AlertModal: FunctionComponent<AlertModalProps> = ({
  isOpen,
  onClose,
  heading,
  ok,
  children,
}) => {
  const onToggle = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      label={heading}
      showLabelIcon={false}
      showMandatoryFieldLegend={false}
      toggleModal={(value: boolean) => {
        onToggle(value);
      }}
      className={styles.modal}
    >
      {children}
      <Button className={styles.okButton} onClick={() => onClose()}>
        {ok}
      </Button>
    </Modal>
  );
};

export default AlertModal;
