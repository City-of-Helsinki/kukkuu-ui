import * as React from 'react';
import {
  Button as HdsButton,
  ButtonProps as HDSButtonProps,
  ButtonVariant,
} from 'hds-react';

type ButtonProps = Omit<HDSButtonProps, 'variant' | 'children'> & {
  variant?:
    | HDSButtonProps['variant']
    | 'disabled'
    | 'dropdown'
    | 'primary'
    | 'secondary'
    | 'supplementary';
  children?: React.ReactNode;
};

const kukkuuSecondaryButtonStyles = {
  '--background-color': 'transparent',
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
const kukkuuDropdownButtonStyles = {
  '--color': 'var(--color-black-90)',
  '--color-hover': 'var(--color-white)',
  '--color-focus': 'var(--color-white)',
  '--color-hover-focus': 'var(--color-white)',
  '--background-color': 'var(--color-white)',
  '--background-color-hover': 'var(--color-bus)',
  '--background-color-focus': 'var(--color-bus)',
  '--background-color-hover-focus': 'var(--color-bus)',
  '--border-color': 'none',
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
  // Convert string variants to ButtonVariant enums for HDS 4.x compatibility
  let hdsVariant: HDSButtonProps['variant'] =
    variant as HDSButtonProps['variant'];

  switch (variant) {
    case 'primary':
      hdsVariant = ButtonVariant.Primary;
      break;
    case 'secondary':
      hdsVariant = ButtonVariant.Secondary;
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuSecondaryButtonStyles,
      };
      break;
    case 'supplementary':
      hdsVariant = ButtonVariant.Supplementary;
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuSupplementaryButtonStyles,
      };
      break;
    case 'disabled':
      // Can be used to set the button to appear disabled without
      // actually disabling it.
      hdsVariant = ButtonVariant.Primary;
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuDisabledButtonStyles,
      };
      break;
    case 'dropdown':
      hdsVariant = ButtonVariant.Primary;
      style = {
        ...kukkuuButtonStyles,
        ...kukkuuDropdownButtonStyles,
      };
      break;
    default:
      if (variant && typeof variant === 'object') {
        // Already a ButtonVariant enum
        hdsVariant = variant;
      }
  }

  return (
    <HdsButton
      className={className}
      style={style}
      variant={hdsVariant || ButtonVariant.Primary}
      iconEnd={undefined}
      {...rest}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {children as any}
    </HdsButton>
  );
};

export default Button;
