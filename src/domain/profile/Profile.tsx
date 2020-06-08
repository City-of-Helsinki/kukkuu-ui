import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import { profileQuery as ProfileQueryType } from '../api/generatedTypes/profileQuery';
import { clearProfile } from './state/ProfileActions';
import profileQuery from './queries/ProfileQuery';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import ProfileChildrenList from './children/ProfileChildrenList';
import PageWrapper from '../app/layout/PageWrapper';
import styles from './profile.module.scss';
import Icon from '../../common/components/icon/Icon';
import phoneIcon from '../../assets/icons/svg/mobile.svg';
import emailIcon from '../../assets/icons/svg/envelope.svg';
import settingsIcon from '../../assets/icons/svg/gear.svg';
import Button from '../../common/components/button/Button';
import EditProfileModal from './modal/EditProfileModal';
import ErrorMessage from '../../common/components/error/Error';

const Profile = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { loading, error, data } = useQuery<ProfileQueryType>(profileQuery);
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

  if (!data?.myProfile) {
    // User has logged in, but not created a profile, send them to front page for registration.
    return <Redirect to="/" />;
  }

  return (
    <PageWrapper className={styles.wrapper} title={'profile.heading'}>
      <div className={styles.profileWrapper} role="main">
        <div className={styles.profile}>
          <div className={styles.profileContent}>
            <div className={styles.heading}>
              <h1>
                {data.myProfile.firstName} {data.myProfile.lastName}
              </h1>
              <Button
                className={styles.editProfile}
                ariaLabel={t('profile.edit.button.text')}
                onClick={() => setIsOpen(true)}
              >
                <span>{t('profile.edit.button.text')}</span>
                <Icon src={settingsIcon} alt="" />
              </Button>
            </div>
            {isOpen && (
              <EditProfileModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                initialValues={data.myProfile}
              />
            )}
            <div className={styles.guardianInfo}>
              <div className={styles.guardianInfoRow}>
                <Icon
                  src={emailIcon}
                  alt={t('registration.form.guardian.email.input.label')}
                />
                <span>{data.myProfile.email}</span>
              </div>
              <div className={styles.guardianInfoRow}>
                <Icon
                  src={phoneIcon}
                  alt={t('profile.child.detail.phoneNumber')}
                />
                <span>{data.myProfile.phoneNumber}</span>
              </div>
            </div>
            <ProfileChildrenList />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
