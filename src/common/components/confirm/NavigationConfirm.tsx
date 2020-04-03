import React, { FunctionComponent } from 'react';
import { Prompt } from 'react-router-dom';

interface NavigationConfirmProps {
  isHalfFilling: boolean;
  warningMessage?: string;
}

const NavigationConfirm: FunctionComponent<NavigationConfirmProps> = ({
  isHalfFilling,
  warningMessage,
}) => {
  const promptExists = !!window.onbeforeunload;
  const message = warningMessage || 'Are you sure to leave?';
  if (isHalfFilling && promptExists !== null) {
    window.onbeforeunload = () => message;
  } else {
    window.onbeforeunload = null;
  }

  return promptExists ? (
    <Prompt when={isHalfFilling} message={message} />
  ) : null;
};

export default NavigationConfirm;
