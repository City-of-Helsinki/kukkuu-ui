import * as React from 'react';
import {
  Button as HdsButton,
  ButtonPresetTheme,
  ButtonProps as HDSButtonProps,
  ButtonTheme,
  ButtonVariant,
} from 'hds-react';

import { dropdownButtonTheme } from './buttonTheme';

type ButtonProps = Omit<HDSButtonProps, 'variant' | 'children' | 'theme'> & {
  variant?:
    | HDSButtonProps['variant']
    | 'danger'
    | 'disabled'
    | 'dropdown'
    | 'primary'
    | 'secondary'
    | 'supplementary';
  theme?: ButtonPresetTheme | ButtonTheme;
  children?: React.ReactNode;
};

const Button = ({
  className,
  variant,
  children,
  theme,
  ...rest
}: ButtonProps) => {
  let hdsVariant: HDSButtonProps['variant'] =
    variant as HDSButtonProps['variant'];
  let resolvedTheme = theme;

  switch (variant) {
    case 'primary':
      hdsVariant = ButtonVariant.Primary;
      break;
    case 'secondary':
      hdsVariant = ButtonVariant.Secondary;
      break;
    case 'supplementary':
      hdsVariant = ButtonVariant.Supplementary;
      break;
    case 'disabled':
      hdsVariant = ButtonVariant.Primary;
      break;
    case 'dropdown':
      hdsVariant = ButtonVariant.Primary;
      resolvedTheme = resolvedTheme ?? dropdownButtonTheme;
      break;
    case 'danger':
      hdsVariant = ButtonVariant.Danger;
      break;
    default:
      if (variant && typeof variant === 'object') {
        hdsVariant = variant;
      }
  }

  return (
    <HdsButton
      className={className}
      theme={resolvedTheme}
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
