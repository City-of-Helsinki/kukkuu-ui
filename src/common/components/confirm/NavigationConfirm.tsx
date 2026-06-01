import { FunctionComponent } from 'react';

import { Prompt } from '../prompt/Prompt';

interface NavigationConfirmProps {
  isHalfFilling: boolean;
  warningMessage?: string;
}

const NavigationConfirm: FunctionComponent<NavigationConfirmProps> = ({
  isHalfFilling,
  warningMessage,
}) => {
  const promptExists = !!globalThis.window.onbeforeunload;
  const message = warningMessage || 'Are you sure to leave?';
  if (isHalfFilling && promptExists !== null && globalThis.window) {
    globalThis.window.onbeforeunload = () => message;
  } else {
    globalThis.window.onbeforeunload = null;
  }

  // TODO: Does people ever get here because the browser blocks the rendering?
  return promptExists ? (
    <Prompt
      message={message}
      onConfirm={() => (globalThis.window.onbeforeunload = null)}
      onCancel={() => {}}
    />
  ) : null;
};

export default NavigationConfirm;
