import * as React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IconCross } from 'hds-react';

import styles from './modal.module.scss';
import Icon from '../icon/Icon';
import Button from '../button/Button';
import MandatoryFieldLegend from '../mandatoryFieldLegend/MandatoryFieldLegend';
import { publicSvgIconPaths } from '../../../public_files';

interface ModalProps {
  isOpen: boolean;
  label: string;
  toggleModal: (value: boolean) => void;
  setFormIsFilling?: (value: boolean) => void;
  showLabelIcon?: boolean;
  showHeading?: boolean;
  className?: string;
  icon?: string;
  showMandatoryFieldLegend?: boolean;
  children?: React.ReactNode;
}

const Modal: React.FunctionComponent<ModalProps> = ({
  isOpen,
  label,
  children,
  toggleModal,
  setFormIsFilling,
  showLabelIcon = true,
  className,
  showHeading = true,
  icon = publicSvgIconPaths['childFaceHappy'],
  showMandatoryFieldLegend = true,
}) => {
  const { t } = useTranslation();
  const onClose = () => {
    if (setFormIsFilling) {
      setFormIsFilling(false);
    }
    toggleModal(false);
  };
  return (
    <div className={styles.modalWrapper}>
      {isOpen && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore ts2786
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel={label}
          className={styles.modal}
          overlayClassName={styles.overlay}
          shouldCloseOnOverlayClick={false}
        >
          <div className={styles.closeButtonWrapper}>
            <Button
              variant="secondary"
              onClick={onClose}
              aria-label={t('common.closeButton.altText')}
            >
              <IconCross />
            </Button>
          </div>
          <div className={classNames(styles.modalContent, className)}>
            {showHeading && (
              <div className={styles.heading}>
                {showLabelIcon && <Icon className={styles.icon} src={icon} />}
                {label && <h2>{label}</h2>}
                {showMandatoryFieldLegend && (
                  <MandatoryFieldLegend position="right" />
                )}
              </div>
            )}
            <div className={styles.modalChildren}>{children}</div>
          </div>
        </ReactModal>
      )}
    </div>
  );
};

export default Modal;
