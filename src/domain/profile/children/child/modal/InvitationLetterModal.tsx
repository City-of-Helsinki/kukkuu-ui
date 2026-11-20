import React, { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPresetTheme, Dialog } from 'hds-react';
import { HtmlToReact } from '@city-of-helsinki/react-helsinki-headless-cms';

import Button from '../../../../../common/components/button/Button';
import styles from './invitationLetterModal.module.scss';

export type InvitationLetterEventGroup = {
  id: string;
  name?: string | null;
  invitationMessage?: string | null;
};

export type InvitationLetterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventGroup: InvitationLetterEventGroup | null;
};

type ParsedInvitationContent =
  | {
      heading: null;
      bodyHtml: string;
      bodyLines: null;
    }
  | {
      heading: string | null;
      bodyHtml: null;
      bodyLines: string[];
    };

const parseInvitationContent = (
  rawMessage: string
): ParsedInvitationContent => {
  if (/<[a-z][\s\S]*>/i.test(rawMessage)) {
    return { heading: null, bodyHtml: rawMessage, bodyLines: null };
  }

  const lines = rawMessage
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return {
      heading: null,
      bodyHtml: null,
      bodyLines: lines,
    };
  }

  const [firstLine, ...restLines] = lines;
  return {
    heading: firstLine,
    bodyHtml: null,
    bodyLines: restLines,
  };
};

const InvitationLetterModal: React.FC<InvitationLetterModalProps> = ({
  isOpen,
  onClose,
  eventGroup,
}) => {
  const { t } = useTranslation();
  const openerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      openerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }
  }, [isOpen]);

  const trimmedMessage = eventGroup?.invitationMessage?.trim();

  if (!eventGroup || !trimmedMessage) {
    return null;
  }

  const titleId = `invitation-letter-modal-title-${eventGroup.id}`;
  const descriptionId = `invitation-letter-modal-description-${eventGroup.id}`;
  const modalTitle = eventGroup.name
    ? t('profile.events.invitationLetter.modal.title', {
        eventGroupName: eventGroup.name,
      })
    : t('profile.events.invitationLetter.modal.titleDefault');

  const { heading, bodyHtml, bodyLines } =
    parseInvitationContent(trimmedMessage);

  return (
    <Dialog
      id={`invitation-letter-dialog-${eventGroup.id}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      isOpen={isOpen}
      close={onClose}
      closeButtonLabelText={t('common.closeButton.altText')}
      focusAfterCloseRef={openerRef as React.RefObject<HTMLElement>}
      variant="primary"
      className={styles.modal}
    >
      <Dialog.Header id={titleId} title={modalTitle} />
      <Dialog.Content>
        <div id={descriptionId} className={styles.letterContent}>
          {heading && <h3 className={styles.letterSubject}>{heading}</h3>}
          <article>
            {bodyHtml !== null ? (
              <HtmlToReact>{bodyHtml}</HtmlToReact>
            ) : (
              bodyLines.map((line, index) => <p key={index}>{line}</p>)
            )}
          </article>
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons className={styles.actionButtons}>
        <Button
          variant="primary"
          theme={ButtonPresetTheme.Black}
          fullWidth
          onClick={onClose}
        >
          {t('profile.events.invitationLetter.modal.closeButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default InvitationLetterModal;
