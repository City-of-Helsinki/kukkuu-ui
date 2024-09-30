import { Page, PageContent } from 'react-helsinki-headless-cms/apollo';
import { useLocation } from 'react-router-dom';

import styles from './headlessCmsPage.module.scss';
import NotFound from '../app/notFound/NotFound';

const HeadlessCmsPage = () => {
  const location = useLocation();

  return (
    <Page
      uri={location.pathname}
      className={styles.cmsPageContainer}
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
