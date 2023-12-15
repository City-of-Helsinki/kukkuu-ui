import React from 'react';

import PageWrapper from '../../app/layout/PageWrapper';
import InfoTemplate from './utilityComponents/InfoTemplate';

type Props = {
  title: string | React.ReactElement;
  description: string | React.ReactElement;
  icon?: string;
  callToAction?: {
    label: string | React.ReactElement;
    onClick: () => void;
  };
};

const InfoPageLayout = (props: Props) => {
  return (
    <PageWrapper>
      <InfoTemplate {...props} />
    </PageWrapper>
  );
};

export default InfoPageLayout;
