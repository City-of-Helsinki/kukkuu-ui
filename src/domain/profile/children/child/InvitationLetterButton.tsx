import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPresetTheme, IconDocument } from 'hds-react';

import Button from '../../../../common/components/button/Button';
import styles from './invitationLetterButton.module.scss';

export type InvitationLetterButtonProps = {
  eventGroupName?: string | null;
  hasInvitationMessage: boolean;
  onClick: () => void;
};

const InvitationLetterButton: React.FC<InvitationLetterButtonProps> = ({
  eventGroupName,
  hasInvitationMessage,
  onClick,
}) => {
  const { t } = useTranslation();
  const tooltipId = useId();
  const missingTooltipText = t(
    'profile.events.invitationLetter.missingTooltip'
  );

  const button = (
    <Button
      variant="supplementary"
      theme={ButtonPresetTheme.Black}
      iconStart={<IconDocument aria-hidden="true" />}
      className={styles.invitationLetterButton}
      disabled={!hasInvitationMessage}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-describedby={!hasInvitationMessage ? tooltipId : undefined}
      aria-label={
        eventGroupName
          ? t('profile.events.invitationLetter.readButtonAriaLabel', {
              eventGroupName,
            })
          : t('profile.events.invitationLetter.readButton')
      }
    >
      {t('profile.events.invitationLetter.readButton')}
    </Button>
  );

  if (hasInvitationMessage) {
    return button;
  }

  return (
    <span
      className={styles.disabledTooltipWrapper}
      title={missingTooltipText}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-describedby={tooltipId}
    >
      {button}
      <span id={tooltipId} role="tooltip" className={styles.tooltip}>
        {missingTooltipText}
      </span>
    </span>
  );
};

export default InvitationLetterButton;
