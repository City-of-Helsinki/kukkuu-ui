import { FunctionComponent } from 'react';

import Modal from '../modal/Modal';
import styles from './alertModal.module.scss';
import Button from '../button/Button';

interface AlertModalProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
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
