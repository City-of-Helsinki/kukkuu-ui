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
  theme?: ButtonPresetTheme | ButtonTheme | 'black' | 'bus' | 'coat';
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

  let hdsTheme: ButtonPresetTheme | ButtonTheme | undefined = resolvedTheme as
    | ButtonPresetTheme
    | ButtonTheme
    | undefined;
  if (resolvedTheme === 'black') hdsTheme = ButtonPresetTheme.Black;
  else if (resolvedTheme === 'bus') hdsTheme = ButtonPresetTheme.Bus;
  else if (resolvedTheme === 'coat') hdsTheme = ButtonPresetTheme.Coat;

  return (
    <HdsButton
      className={className}
      theme={hdsTheme}
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
