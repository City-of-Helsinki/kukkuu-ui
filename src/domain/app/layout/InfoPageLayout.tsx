import React from 'react';

import PageWrapper, { PageWrapperProps } from '../../app/layout/PageWrapper';
import InfoTemplate, {
  type InfoTemplateProps,
} from './utilityComponents/InfoTemplate';

const InfoPageLayout = (
  props: InfoTemplateProps & Pick<PageWrapperProps, 'usePageMeta'>
) => {
  const { usePageMeta, ...infoTemplateProps } = props;

  return (
    <PageWrapper usePageMeta={usePageMeta}>
      <InfoTemplate {...infoTemplateProps} />
    </PageWrapper>
  );
};

export default InfoPageLayout;
