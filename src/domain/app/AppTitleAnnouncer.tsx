import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import useAriaLive from '../../common/AriaLive/useAriaLive';

type HelmetConfig = {
  title: string;
};

const AppTitleAnnouncer = () => {
  const { sendMessage } = useAriaLive();
  const lastTitle = useRef<string | null>(null);

  const onHelmetChange = ({ title }: HelmetConfig) => {
    if (lastTitle.current !== title) {
      sendMessage(title);
      lastTitle.current = title;
    }
  };

  return <Helmet onChangeClientState={onHelmetChange} />;
};

export default AppTitleAnnouncer;
