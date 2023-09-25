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
  const promptExists = !!window.onbeforeunload;
  const message = warningMessage || 'Are you sure to leave?';
  if (isHalfFilling && promptExists !== null) {
    window.onbeforeunload = () => message;
  } else {
    window.onbeforeunload = null;
  }

  // TODO: Does people ever get here because the browser blocks the rendering?
  return promptExists ? (
    <Prompt
      message={message}
      onConfirm={() => (window.onbeforeunload = null)}
      onCancel={() => {}}
    />
  ) : null;
};

export default NavigationConfirm;
