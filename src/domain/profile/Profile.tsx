import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPen, useOidcClient } from 'hds-react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import Button from '../../common/components/button/Button';
import GiveFeedbackButton from '../../common/components/giveFeedbackButton/GiveFeedbackButton';
import Text from '../../common/components/text/Text';
import ListPageLayout from '../app/layout/ListPageLayout';
import ProfileChildrenList from './children/ProfileChildrenList';
import EditProfileModal from './modal/EditProfileModal';
import { useProfileContext } from './hooks/useProfileContext';
import useGetPathname from '../../common/route/utils/useGetPathname';

const Profile = () => {
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { isAuthenticated, login } = useOidcClient();
  const isLoggedIn = isAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <ListPageLayout>
      <ListPageLayout.Header
        title={t('profile.message.greetings', {
          firstName: profile.firstName,
        })}
        content={
          <Text variant="body-l">
            {t('profile.common.message.serviceDescription')}
          </Text>
        }
        actions={
          <Button
            variant="secondary"
            iconLeft={<IconPen />}
            onClick={() => setIsOpen(true)}
          >
            {t('profile.edit.button.text')}
          </Button>
        }
      />
      {isOpen && (
        <EditProfileModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          initialValues={profile}
        />
      )}
      <ProfileChildrenList />
      <GiveFeedbackButton />
    </ListPageLayout>
  );
};

export default Profile;
