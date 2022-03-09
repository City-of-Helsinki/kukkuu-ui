import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { Container, IconPen } from 'hds-react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import ErrorMessage from '../../common/components/error/Error';
import Button from '../../common/components/button/Button';
import GiveFeedbackButton from '../../common/components/giveFeedbackButton/GiveFeedbackButton';
import Text from '../../common/components/text/Text';
import PageWrapper from '../app/layout/PageWrapper';
import { clearProfile } from './state/ProfileActions';
import useProfile from './hooks/useProfile';
import ProfileChildrenList from './children/ProfileChildrenList';
import EditProfileModal from './modal/EditProfileModal';
import styles from './profile.module.scss';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, data } = useProfile();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
    return <Redirect to="/" />;
  }

  return (
    <PageWrapper className={styles.wrapper}>
      <Container role="main" className={styles.container}>
        <div className={styles.header}>
          <Text variant="h1">
            {t('profile.message.greetings', {
              firstName: data.firstName,
            })}
          </Text>
          <Text variant="body-l">
            {t('profile.message.serviceDescription')}
          </Text>
          <Button
            variant="secondary"
            iconLeft={<IconPen />}
            onClick={() => setIsOpen(true)}
          >
            {t('profile.edit.button.text')}
          </Button>
        </div>
        {isOpen && (
          <EditProfileModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initialValues={data}
          />
        )}
        <ProfileChildrenList />
        <GiveFeedbackButton />
      </Container>
    </PageWrapper>
  );
};

export default Profile;
