import { useRef, RefObject } from 'react';
import classnames from 'classnames';
import { useOidcClient } from 'hds-react';
import { TemplateEnum } from '@city-of-helsinki/react-helsinki-headless-cms';

import styles from './home.module.scss';
import HomePreliminaryForm from './form/HomePreliminaryForm';
import PageWrapper from '../app/layout/PageWrapper';
import HomeHero from './hero/HomeHero';
import HomeInstructions from './instructions/HomeInstructions';
import HomePartners from './partners/HomePartners';
import HomeVideo from './video/HomeVideo';
import HomeContact from './contact/HomeContact';
import HomeMoreInfo from './moreInfo/HomeMoreInfo';
import { useProfileContext } from '../profile/hooks/useProfileContext';
import usePageByTemplateQuery from '../../hooks/usePageByTemplateQuery';
import {
  getCmsPageDescription,
  getCmsPageImage,
  getCmsPageTitle,
} from '../../utils/cmsUtils';

/**
 * Front page component for the Kukkuu service.
 *
 * Integrates WordPress Headless CMS frontpage content, hero section with background image,
 * registration preliminary form, service instructions, partners, video, and contact sections.
 */
const Home = () => {
  const { isAuthenticated } = useOidcClient();
  const isLoggedIn = isAuthenticated();
  const { profile } = useProfileContext();
  const userHasProfile = !!profile;
  const formRef = useRef<HTMLDivElement>(null);
  const { data: cmsPageData } = usePageByTemplateQuery(TemplateEnum.FrontPage);
  const page = cmsPageData?.pageByTemplate;

  const scrollToForm = (formRef: RefObject<HTMLDivElement | null>) => {
    if (formRef?.current) {
      globalThis.window.scrollTo(0, formRef.current.offsetTop);
    }
  };

  const heroImage = page ? getCmsPageImage(page) : undefined;

  return (
    <PageWrapper
      page={page}
      image={heroImage?.url}
      containerClassName={classnames(
        styles.gridLayoutOverride,
        userHasProfile && styles.userHasProfileContainer
      )}
    >
      <div className={styles.home}>
        <HomeHero
          title={getCmsPageTitle(page)}
          description={
            page !== null && page !== undefined
              ? getCmsPageDescription(page)
              : undefined
          }
          image={heroImage}
          userHasProfile={userHasProfile}
          userIsAuthenticated={isLoggedIn}
          scrollToForm={() => scrollToForm(formRef)}
        />
        <HomeMoreInfo />
        <HomeInstructions />
        {!userHasProfile && (
          <HomePreliminaryForm
            forwardRef={formRef}
            isAuthenticated={isLoggedIn}
          />
        )}
        <HomeVideo />
        <HomePartners />
        <HomeContact />
      </div>
    </PageWrapper>
  );
};

export default Home;
