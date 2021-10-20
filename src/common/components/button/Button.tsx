import * as React from 'react';
import { Button as HdsButton, ButtonProps as HDSButtonProps } from 'hds-react';

type ButtonProps = Omit<HDSButtonProps, 'variant'> & {
  variant?: HDSButtonProps['variant'] | 'disabled';
};

const kukkuuSecondaryButtonStyles = {
  '--background-color': 'var(--color-white)',
  '--background-color-hover': 'var(--color-white)',
  '--background-color-focus': 'var(--color-white)',
  '--background-color-hover-focus': 'var(--color-white)',
};
const kukkuuSupplementaryButtonStyles = {
  '--background-color': 'transparent',
  '--background-color-hover': 'transparent',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'transparent',
  '--border-color': 'none',
};
const kukkuuDisabledButtonStyles = {
  '--background-color': 'var(--color-black-20)',
  '--background-color-hover': 'var(--color-black-30)',
  '--background-color-focus': 'var(--color-black-40)',
  '--background-color-hover-focus': 'var(--color-black-40)',
  '--border-color': 'var(--color-black-20)',
  '--border-color-hover': 'var(--color-black-30)',
  '--border-color-hover-focus': 'var(--color-black-40)',
  '--border-color-focus': 'var(--color-black-40)',
};

const kukkuuButtonStyles = {
  '--color': 'var(--color-black)',
  '--color-hover': 'var(--color-black)',
  '--color-focus': 'var(--color-black-90)',
  '--color-hover-focus': 'var(--color-black-90)',
  '--background-color': 'var(--color-summer)',
  '--background-color-hover': 'var(--color-summer-dark)',
  '--background-color-focus': 'var(--color-summer)',
  '--background-color-hover-focus': 'var(--color-summer-dark)',
  '--background-selected': 'var(--color-summer)',
  '--border-color': 'var(--color-summer)',
  '--border-color-hover': 'var(--color-summer-dark)',
  '--border-color-focus': 'var(--color-summer-dark)',
  '--border-color-hover-focus': 'var(--color-summer-dark)',
  '--border-color-selected': 'var(--color-summer)',
  '--border-color-selected-hover': 'var(--color-summer-dark)',
  '--border-color-selected-focus': 'var(--color-summer)',
  '--border-color-selected-hover-focus': 'var(--color-summer)',
} as React.CSSProperties;

const Button = ({
  style = kukkuuButtonStyles,
  className,
  variant,
  children,
  ...rest
}: ButtonProps) => {
  switch (variant) {
    case 'secondary':
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuSecondaryButtonStyles,
      };
      break;
    case 'supplementary':
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuSupplementaryButtonStyles,
      };
      break;
    case 'disabled':
      // Can be used to set the button to appear disabled without
      // actually disabling it.
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuDisabledButtonStyles,
      };
      break;
    default:
  }

  return (
    <HdsButton
      className={className}
      style={style}
      children={children}
      {...rest}
    ></HdsButton>
  );
};

export default Button;
