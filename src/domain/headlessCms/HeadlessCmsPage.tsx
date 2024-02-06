import { Page, PageContent } from 'react-helsinki-headless-cms/apollo';
import { useLocation } from 'react-router';

import Notification from '../app/notification/Notification';
import NotFound from '../app/notFound/NotFound';

const HeadlessCmsPage = () => {
  const location = useLocation();

  return (
    <Page
      uri={location.pathname}
      navigation={undefined}
      content={
        <PageContent
          notFoundPageContent={<NotFound />}
          collections={() => null}
        />
      }
      footer={undefined}
    />
  );
};

export default HeadlessCmsPage;
