import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { IconCogwheel } from 'hds-react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import Icon from '../../common/components/icon/Icon';
import ErrorMessage from '../../common/components/error/Error';
import Button from '../../common/components/button/Button';
import GiveFeedbackButton from '../../common/components/giveFeedbackButton/GiveFeedbackButton';
import phoneIcon from '../../assets/icons/svg/mobile.svg';
import emailIcon from '../../assets/icons/svg/envelope.svg';
import PageWrapper from '../app/layout/PageWrapper';
import { clearProfile } from './state/ProfileActions';
import useProfile from './hooks/useProfile';
import ProfileChildrenList from './children/ProfileChildrenList';
import EditProfileModal from './modal/EditProfileModal';
import styles from './profile.module.scss';

const Profile = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
      <div className={styles.profileWrapper} role="main">
        <div className={styles.profile}>
          <div className={styles.profileContent}>
            <div className={styles.heading}>
              <h1>
                {data.firstName} {data.lastName}
              </h1>
              <Button
                variant="supplementary"
                className={styles.editProfileButton}
                iconRight={<IconCogwheel />}
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
            <div className={styles.guardianInfo}>
              <div className={styles.guardianInfoRow}>
                <Icon
                  src={emailIcon}
                  alt={t('registration.form.guardian.email.input.label')}
                />
                <span>{data.email}</span>
              </div>
              <div className={styles.guardianInfoRow}>
                <Icon
                  src={phoneIcon}
                  alt={t('profile.child.detail.phoneNumber')}
                />
                <span>{data.phoneNumber}</span>
              </div>
            </div>
            <ProfileChildrenList />
          </div>
          <GiveFeedbackButton />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
