import React from 'react';
import { ButtonPresetTheme, IconPen } from 'hds-react';
import classNames from 'classnames';

import Button from '../../../common/components/button/Button';
import styles from './editDetailsButton.module.scss';

export interface EditDetailsButtonProps {
  onClick: () => void;
  ariaLabel: string;
  label: string;
  className?: string;
}

/**
 * Shared supplementary edit button used in both guardian and child profile cards.
 */
const EditDetailsButton: React.FC<EditDetailsButtonProps> = ({
  onClick,
  ariaLabel,
  label,
  className,
}) => (
  <Button
    variant="supplementary"
    theme={ButtonPresetTheme.Black}
    iconStart={<IconPen aria-hidden="true" />}
    className={classNames(styles.editButton, className)}
    onClick={onClick}
    aria-haspopup="dialog"
    aria-label={ariaLabel}
  >
    {label}
  </Button>
);

export default EditDetailsButton;
