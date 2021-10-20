import { useRef, RefObject } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import styles from './home.module.scss';
import HomePreliminaryForm from './form/HomePreliminaryForm';
import PageWrapper from '../app/layout/PageWrapper';
import HomeHero from './hero/HomeHero';
import HomeInstructions from './instructions/HomeInstructions';
import HomePartners from './partners/HomePartners';
import HomeVideo from './video/HomeVideo';
import HomeContact from './contact/HomeContact';
import { isAuthenticatedSelector } from '../auth/state/AuthenticationSelectors';
import HomeMoreInfo from './moreInfo/HomeMoreInfo';
import { userHasProfileSelector } from '../registration/state/RegistrationSelectors';

const Home = () => {
  const userIsAuthenticated = useSelector(isAuthenticatedSelector);
  const userHasProfile = useSelector(userHasProfileSelector);

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
          userIsAuthenticated={userIsAuthenticated}
          scrollToForm={() => scrollToForm(formRef)}
        />
        <HomeMoreInfo />
        <HomeInstructions />
        {!userHasProfile && <HomePreliminaryForm forwardRef={formRef} />}
        <HomeVideo />
        <HomePartners />
        <HomeContact />
      </div>
    </PageWrapper>
  );
};

export default Home;
