import { FunctionComponent } from 'react';

import Modal from '../modal/Modal';
import styles from './confirmModal.module.scss';
import Button from '../button/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setIsOpen: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  answer: Function;
  heading: string;
  cancel: string;
  ok: string;
  children?: React.ReactNode;
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
      showMandatoryFieldLegend={false}
      toggleModal={(value: boolean) => {
        setIsOpen(value);
      }}
      className={styles.modal}
    >
      {children}
      <div className={styles.buttonGroup}>
        <Button
          className={styles.cancelButton}
          variant="secondary"
          onClick={onCancel}
        >
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
