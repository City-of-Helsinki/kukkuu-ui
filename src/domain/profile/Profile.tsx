import React from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbListItem, Container, useOidcClient } from 'hds-react';
import { useNavigate } from 'react-router';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import PageMeta from '../app/layout/utilityComponents/PageMeta';
import ProfileHero from './hero/ProfileHero';
import ProfileChildrenList from './children/ProfileChildrenList';
import ProfileGuardianSection from './guardian/ProfileGuardianSection';
import { useProfileContext } from './hooks/useProfileContext';
import useGetPathname from '../../common/route/utils/useGetPathname';
import styles from './profile.module.scss';

const Profile = () => {
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { isAuthenticated, login } = useOidcClient();
  const isLoggedIn = isAuthenticated();
  const {
    profile,
    isLoading: isProfileLoading,
    isFetchCalled,
  } = useProfileContext();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line no-console
      console.info('User is unauthenticated. Calling the login.');
      // User has not logged in, so request authentication
      login();
    }
  }, [isLoggedIn, login]);

  React.useEffect(() => {
    // If the user has no profile it means that they have not yet
    // registered to kukkuu. In this case we want to redirect them
    // into the landing page where they can start the registration
    // process.
    if (isLoggedIn && !isProfileLoading && isFetchCalled && !profile?.id) {
      // eslint-disable-next-line no-console
      console.info(
        'User has logged in, but not created a profile. Send them to front page for registration.'
      );
      navigate(getPathname('/home#register'), { replace: true });
    }
  }, [
    getPathname,
    isFetchCalled,
    isLoggedIn,
    isProfileLoading,
    navigate,
    profile?.id,
  ]);

  if (!profile) {
    // eslint-disable-next-line no-console
    console.info(
      'Using a loading spinner to wait for profile to be added in the context.'
    );
    return <LoadingSpinner isLoading={true} />;
  }

  const breadcrumbs: BreadcrumbListItem[] = [
    {
      title: t('common.breadcrumbs.home'),
      path: getPathname('/'),
    },
    {
      title: t('profile.breadcrumbs.account', { defaultValue: 'Tili' }),
      path: null,
    },
  ];

  return (
    <>
      <PageMeta title="profile.heading" />
      <div className={styles.profilePageWrapper}>
        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumb
            aria-label={t('common.breadcrumbNavigationLabel')}
            list={breadcrumbs}
            className={styles.breadcrumbs}
          />
        </div>
        <ProfileHero profile={profile} />
        <Container role="main" className={styles.mainContainer}>
          <ProfileChildrenList />
          <ProfileGuardianSection profile={profile} />
        </Container>
      </div>
    </>
  );
};

export default Profile;
