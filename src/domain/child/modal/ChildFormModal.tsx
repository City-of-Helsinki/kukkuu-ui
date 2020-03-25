import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../common/components/modal/Modal';
import styles from './childFormModal.module.scss';
import { Child } from '../types/ChildTypes';
import NavigationPropmt from '../../../common/components/prompt/NavigationPrompt';
import ChildForm from '../form/ChildForm';

export interface ChildFormModalValues extends Omit<Child, 'birthdate'> {
  birthdate: {
    day: number | string;
    month: number | string;
    year: number | string;
  };
  childBirthdate?: string;
}

interface ChildFormModalProps {
  initialValues: ChildFormModalValues;
  label: string;
  onSubmit: (payload: Child) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formType?: CHILD_FORM_TYPES;
}

export enum CHILD_FORM_TYPES {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

const ChildFormModal: FunctionComponent<ChildFormModalProps> = ({
  initialValues,
  label,
  onSubmit,
  onCancel,
  onDelete,
  isOpen,
  setIsOpen,
  formType = CHILD_FORM_TYPES.ADD,
}) => {
  const { t } = useTranslation();
  const [isFilling, setFormIsFilling] = useState(false);

  return (
    <div className={styles.childFormModalWrapper}>
      {isOpen && (
        // FIXME: Edit data -> Close modal -> Refresh
        <NavigationPropmt
          warningMessage={t('common.form.leave.warning.text')}
          isHalfFilling={isFilling}
        />
      )}
      <Modal
        isOpen={isOpen}
        label={label}
        toggleModal={(value: boolean) => {
          setIsOpen(value);
        }}
        setFormIsFilling={setFormIsFilling}
      >
        <ChildForm
          setFormIsFilling={setFormIsFilling}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          formType={formType}
          onDelete={onDelete}
        />
      </Modal>
    </div>
  );
};

export default ChildFormModal;
