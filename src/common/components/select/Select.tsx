import * as React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './select.module.scss';

type SelectOption = {
  label: string;
  value: string | string[] | undefined;
};
type SelectOptions = SelectOption[];

export interface SelectProps {
  autoSelect?: boolean;
  options: SelectOptions;
  value?: string | string[];
  onChange: React.ChangeEventHandler<HTMLElement>;
  onBlur?: React.ChangeEventHandler<HTMLElement>;
  label?: string;
  name: string;
  required?: boolean;
}

const Select: React.FunctionComponent<SelectProps> = ({
  options,
  autoSelect,
  label,
  name,
  required,
  value,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.selectWrapper}>
      {label && <label htmlFor={name}>{required ? `${label}*` : label}</label>}
      <select name={name} value={value === null ? '' : value} {...rest}>
        {!autoSelect && (
          <option value="" key="no selection">
            {t('common.select.default.text')}
          </option>
        )}
        {options.map((selectOption) => (
          <option value={selectOption.value} key={selectOption.label}>
            {selectOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
