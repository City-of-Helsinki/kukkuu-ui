import React, { FunctionComponent, ReactElement } from 'react';
import classnames from 'classnames';

import styles from './input.module.scss';

type InputElementAttributes = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface InputProps extends InputElementAttributes {
  type: string;
  label: string | ReactElement | undefined;
  id: string;
}
const Input: FunctionComponent<InputProps> = ({
  type = 'text',
  className,
  label,
  id,
  ...rest
}) => {
  return (
    <div className={classnames(styles.inputWrapper, styles[`${type}Input`])}>
      <div className={styles.inputTypeWrapper}>
        {label && <label htmlFor={id}>{label}</label>}
        <input type={type} id={id} {...rest} />
      </div>
    </div>
  );
};

export default Input;
