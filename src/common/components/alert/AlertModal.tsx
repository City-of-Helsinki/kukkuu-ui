import React, { FunctionComponent } from 'react';

import Modal from '../modal/Modal';
import Button from '../button/Button';
import styles from './alertModal.module.scss';

interface AlertModalProps {
  isOpen: boolean;
  onClose: Function;
  heading: string;
  ok: string;
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
