import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './profileChildSkeleton.module.scss';

export interface ProfileChildSkeletonProps {
  className?: string;
}

const ProfileChildSkeleton: React.FC<ProfileChildSkeletonProps> = ({
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      aria-label={t('common.loading')}
      className={`${styles.skeletonCard} ${className || ''}`}
      data-testid="profile-child-skeleton"
    >
      <div className={styles.headerShimmer} />
      <div className={styles.contentWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.avatarShimmer} />
          <div className={styles.nameShimmer} />
          <div className={styles.metaShimmer} />
          <div className={styles.buttonShimmer} />
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.titleShimmer} />
          <div className={styles.searchBtnShimmer} />
          <div className={styles.eventCardShimmer} />
          <div className={styles.pastEventsShimmer} />
        </div>
      </div>
    </div>
  );
};

export default ProfileChildSkeleton;
