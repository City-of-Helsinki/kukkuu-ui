import React, { FunctionComponent, useState } from 'react';
// import { Formik, FieldArray, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
// import classnames from 'classnames';

import Modal from '../../../common/components/modal/Modal';
import styles from './childFormModal.module.scss';
// import BirthdateFormField from '../../home/form/partial/BirthdateFormField';
// import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
// import InputField from '../../../common/components/form/fields/input/InputField';
// import Button from '../../../common/components/button/Button';
// import SelectField from '../../../common/components/form/fields/select/SelectField';
import { Child } from '../types/ChildTypes';
// import { getTranslatedRelationshipOptions } from '../ChildUtils';
import NavigationPropmt from '../../../common/components/prompt/NavigationPrompt';
// import {
//   validatePostalCode,
//   validateDate,
// } from '../../../common/components/form/validationUtils';
// import { formatTime, newMoment } from '../../../common/time/utils';
// import { BACKEND_DATE_FORMAT } from '../../../common/time/TimeConstants';
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
  onDelete,
  isOpen,
  setIsOpen,
  formType = CHILD_FORM_TYPES.ADD,
}) => {
  const { t } = useTranslation();
  const [isFilling, setFormIsFilling] = useState(false);

  const onCancel = () => {
    setIsOpen(false);
  };

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
