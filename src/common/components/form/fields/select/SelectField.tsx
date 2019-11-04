import React, { Component } from 'react';
import { FieldProps } from 'formik';

import styles from './selectField.module.scss';

type SelectOption = {
  label: string;
  value: string | string[] | undefined;
};
type SelectOptions = SelectOption[];

type Props = {
  options: SelectOptions;
  value?: string | string[];
  onChange: () => void;
  label: string;
  id: string;
};

class SelectField extends Component<Props & FieldProps> {
  render() {
    const {
      options,
      onChange,
      value,
      field,
      form,
      label,
      id,
      ...rest
    } = this.props;

    return (
      <div className={styles.selectField}>
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
  }
}

export default SelectField;
