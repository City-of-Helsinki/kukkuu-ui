import { PageContent } from 'react-helsinki-headless-cms/apollo';
import { Page } from 'react-helsinki-headless-cms';
import { useLocation } from 'react-router';

import Navigation from '../app/navigation/Navigation';
import Notification from '../app/notification/Notification';
import Footer from '../app/footer/Footer';
import NotFound from '../app/notFound/NotFound';

const HeadlessCmsPage = () => {
  const location = useLocation();

  return (
    <Page
      navigation={<Navigation />}
      notification={<Notification />}
      content={
        <PageContent
          uri={location.pathname}
          notFoundPageContent={<NotFound />}
        />
      }
      footer={<Footer />}
    />
  );
};

export default HeadlessCmsPage;
