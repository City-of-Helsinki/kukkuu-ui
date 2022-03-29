import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { IconPen } from 'hds-react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import ErrorMessage from '../../common/components/error/Error';
import Button from '../../common/components/button/Button';
import GiveFeedbackButton from '../../common/components/giveFeedbackButton/GiveFeedbackButton';
import Text from '../../common/components/text/Text';
import useGetPathname from '../../common/route/utils/useGetPathname';
import ListPageLayout from '../app/layout/ListPageLayout';
import { clearProfile } from './state/ProfileActions';
import useProfile from './hooks/useProfile';
import ProfileChildrenList from './children/ProfileChildrenList';
import EditProfileModal from './modal/EditProfileModal';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, data } = useProfile();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getPathname = useGetPathname();

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    dispatch(clearProfile());
    Sentry.captureException(error);
    return <ErrorMessage message={t('api.errorMessage')} />;
  }

  if (!data) {
    // User has logged in, but not created a profile, send them to front page for registration.
    return <Redirect to={getPathname('/')} />;
  }

  return (
    <ListPageLayout>
      <ListPageLayout.Header
        title={t('profile.message.greetings', {
          firstName: data.firstName,
        })}
        content={
          <Text variant="body-l">
            {t('profile.message.serviceDescription')}
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
          initialValues={data}
        />
      )}
      <ProfileChildrenList />
      <GiveFeedbackButton />
    </ListPageLayout>
  );
};

export default Profile;
