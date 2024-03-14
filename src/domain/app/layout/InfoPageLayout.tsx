import React from 'react';

import PageWrapper from '../../app/layout/PageWrapper';
import InfoTemplate, {
  type InfoTemplateProps,
} from './utilityComponents/InfoTemplate';

const InfoPageLayout = (props: InfoTemplateProps) => {
  return (
    <PageWrapper>
      <InfoTemplate {...props} />
    </PageWrapper>
  );
};

export default InfoPageLayout;
