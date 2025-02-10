import { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';

import AriaLiveContext from './AriaLiveContext';
import useAriaLive from './useAriaLive';
import styles from './ariaLive.module.css';

function AriaLiveRegion() {
  const { message } = useAriaLive();

  return (
    <div aria-live="polite" className={styles.visuallyHidden}>
      {message}
    </div>
  );
}

function getOrCreateContainer(id: string) {
  const container = document.getElementById(id);

  if (container) {
    return container;
  }

  const createdContainer = document.createElement('div');

  createdContainer.id = id;
  document.body.append(createdContainer);

  return createdContainer;
}

type Props = {
  children: ReactNode;
  id?: string;
  dataTestId?: string;
};

function AriaLiveProvider({
  children,
  id = 'aria-live-root',
  dataTestId,
}: Readonly<Props>) {
  const rootElement = getOrCreateContainer(id);
  if (dataTestId) {
    rootElement.setAttribute('data-testid', dataTestId);
  }
  const [message, sendMessage] = useState<string>('');

  return (
    <AriaLiveContext.Provider
      value={{
        message,
        sendMessage,
      }}
    >
      {children}
      {ReactDOM.createPortal(<AriaLiveRegion />, rootElement) as ReactNode}
    </AriaLiveContext.Provider>
  );
}

export default AriaLiveProvider;
