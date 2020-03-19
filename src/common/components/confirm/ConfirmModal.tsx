import React, { FunctionComponent } from 'react';

import Modal from '../modal/Modal';
import Button from '../button/Button';
import styles from './confirmModal.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  answer: Function;
  heading: string;
  cancel: string;
  ok: string;
}

const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({
  isOpen,
  setIsOpen,
  answer,
  heading,
  cancel,
  ok,
  children,
}) => {
  const onOk = () => {
    setIsOpen(false);
    answer(true);
  };

  const onCancel = () => {
    setIsOpen(false);
    answer(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      label={heading}
      showLabelIcon={false}
      toggleModal={(value: boolean) => {
        setIsOpen(value);
      }}
      className={styles.modal}
    >
      {children}
      <div className={styles.buttonGroup}>
        <Button className={styles.cancelButton} onClick={onCancel}>
          {cancel}
        </Button>
        <Button className={styles.okButton} onClick={onOk}>
          {ok}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
