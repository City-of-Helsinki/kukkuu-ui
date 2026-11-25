import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, IconUser, IconSize } from 'hds-react';

import EditDetailsButton from '../components/EditDetailsButton';
import EditProfileModal from '../modal/EditProfileModal';
import { MyProfile } from '../types/ProfileQueryTypes';
import styles from './profileGuardianSection.module.scss';

export interface ProfileGuardianSectionProps {
  profile: MyProfile;
}

const ProfileGuardianSection: React.FC<ProfileGuardianSectionProps> = ({
  profile,
}) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const guardianName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={styles.guardianSection}
      aria-labelledby="guardian-heading"
    >
      <h2 id="guardian-heading" className={styles.heading}>
        {t('profile.guardian.heading')}
      </h2>
      <Card border className={styles.card}>
        <IconUser
          size={IconSize.Large}
          className={styles.avatar}
          aria-hidden="true"
        />
        <h3 className={styles.name}>{guardianName}</h3>
        {profile.phoneNumber && (
          <p className={styles.phone}>p. {profile.phoneNumber}</p>
        )}
        {profile.email && <p className={styles.email}>{profile.email}</p>}
        <EditDetailsButton
          onClick={() => setIsEditModalOpen(true)}
          ariaLabel={t('profile.guardian.edit.ariaLabel')}
          label={t('profile.guardian.edit.buttonText')}
        />
      </Card>
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          initialValues={profile}
        />
      )}
    </section>
  );
};

export default ProfileGuardianSection;
