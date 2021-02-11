import React from 'react';
import { Helmet } from 'react-helmet-async';

import useAriaLive from '../../common/AriaLive/useAriaLive';

type HelmetConfig = {
  title: string;
};

const AppTitleAnnouncer = () => {
  const { sendMessage } = useAriaLive();

  const onHelmetChange = ({ title }: HelmetConfig) => sendMessage(title);

  return <Helmet onChangeClientState={onHelmetChange} />;
};

export default AppTitleAnnouncer;
