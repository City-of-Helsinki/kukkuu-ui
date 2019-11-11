import * as React from 'react';

import styles from './select.module.scss';

type SelectOption = {
  label: string;
  value: string | string[] | undefined;
};
type SelectOptions = SelectOption[];

export interface SelectProps {
  options: SelectOptions;
  value?: string | string[];
  onChange: React.ChangeEventHandler<HTMLElement>;
  label?: string;
  id: string;
}

const Select: React.FunctionComponent<SelectProps> = ({
  options,
  onChange,
  value,
  label,
  id,
  ...rest
}) => {
  return (
    <div className={styles.selectWrapper}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        onChange={onChange}
        id={id}
        value={value || options[0].value}
        {...rest}
      >
        {options.map(selectOption => (
          <option value={selectOption.value} key={selectOption.label}>
            {selectOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
