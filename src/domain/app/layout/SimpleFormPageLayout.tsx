import React from 'react';

import PageWrapper from './PageWrapper';
import SimpleFormTemplate, {
  SimpleFormTemplateProps,
} from './utilityComponents/SimpleFormTemplate';

const SimpleFormPageLayout = (props: SimpleFormTemplateProps) => {
  return (
    <PageWrapper>
      <SimpleFormTemplate {...props} />
    </PageWrapper>
  );
};

export default SimpleFormPageLayout;
