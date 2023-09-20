import { FunctionComponent } from 'react';
import ReactRouterPrompt from 'react-router-prompt';

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
    <ReactRouterPrompt when={isHalfFilling}>
      {({ isActive, onConfirm, onCancel }) =>
        isActive ? <div>{message}</div> : null
      }
    </ReactRouterPrompt>
  ) : null;
};

export default NavigationConfirm;
