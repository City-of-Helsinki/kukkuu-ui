import { useRef, RefObject } from 'react';
import classnames from 'classnames';
import { useOidcClient } from 'hds-react';

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

const Home = () => {
  const { isAuthenticated } = useOidcClient();
  const isLoggedIn = isAuthenticated();
  const { profile } = useProfileContext();
  const userHasProfile = !!profile;
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = (formRef: RefObject<HTMLDivElement>) => {
    if (formRef && formRef.current) {
      window.scrollTo(0, formRef.current.offsetTop);
    }
  };

  return (
    <PageWrapper
      containerClassName={classnames(
        styles.gridLayoutOverride,
        userHasProfile && styles.userHasProfileContainer
      )}
    >
      <div className={styles.home}>
        <HomeHero
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
