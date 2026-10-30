import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, IconPen, IconUser, IconSize } from 'hds-react';

import Button from '../../../common/components/button/Button';
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
        <Button
          variant="supplementary"
          theme="black"
          iconStart={<IconPen aria-hidden="true" />}
          className={styles.editButton}
          onClick={() => setIsEditModalOpen(true)}
          aria-haspopup="dialog"
          aria-label={t('profile.guardian.edit.ariaLabel')}
        >
          {t('profile.guardian.edit.buttonText')}
        </Button>
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
