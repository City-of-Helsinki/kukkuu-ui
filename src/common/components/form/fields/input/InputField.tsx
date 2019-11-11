import React from 'react';
import { FieldProps, getIn } from 'formik';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import Input from '../../../input/Input';
import styles from './inputField.module.scss';

interface InputField extends FieldProps {
  id: string;
  label: string;
  type: string;
}

const InputField: React.ComponentType<InputField> = ({
  field,
  form: { errors, touched },
  ...rest
}) => {
  const error = getIn(errors, field.name);
  const touch = getIn(touched, field.name);
  const inputError = touch && error ? error : null;

  const { t } = useTranslation();

  return (
    <div
      className={classnames(styles.inputField, {
        [styles.inputError]: !!inputError,
      })}
    >
      <Input {...field} {...rest} />
      <div className={styles.inputErrorMessage}>{t(inputError)}</div>
    </div>
  );
};

export default InputField;
