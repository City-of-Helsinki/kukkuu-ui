import React from 'react';
import { Dialog, Button, IconQuestionCircle, ButtonVariant } from 'hds-react';
import { useTranslation } from 'react-i18next';

export type PromptProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const Prompt = ({ message, onConfirm, onCancel }: PromptProps) => {
  const { t } = useTranslation();
  const openConfirmationDialogButtonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const close = () => setIsOpen(false);
  const titleId = 'confirmation-dialog-title';
  const descriptionId = 'confirmation-dialog-info';
  return (
    <Dialog
      id="confirmation-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      isOpen={isOpen}
      focusAfterCloseRef={openConfirmationDialogButtonRef}
    >
      <Dialog.Header
        id={titleId}
        title=""
        iconStart={<IconQuestionCircle aria-hidden="true" />}
      />
      <Dialog.Content>
        <p id={descriptionId} className="text-body">
          {message}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button
          onClick={() => {
            onConfirm();
            close();
          }}
        >
          {t('') ?? 'Continue'}
        </Button>
        <Button
          onClick={() => {
            onCancel();
            close();
          }}
          variant={ButtonVariant.Secondary}
        >
          {t('common:backButton') ?? 'Cancel'}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};
