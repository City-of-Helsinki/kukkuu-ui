import * as React from 'react';
import { Prompt } from 'react-router-dom';

interface NavigationPropmtProps {
  isHalfFilling: boolean;
  warningMessage?: string;
}

// TODO: rename NavigationConfirm
const NavigationPropmt: React.FunctionComponent<NavigationPropmtProps> = ({
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

export default NavigationPropmt;
