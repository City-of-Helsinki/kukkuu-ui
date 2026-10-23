import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import { MyProfile } from '../types/ProfileQueryTypes';
import styles from './profileHero.module.scss';

export interface ProfileHeroProps {
  profile?: MyProfile | null;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  const { t } = useTranslation();

  const title = profile?.firstName
    ? t('profile.hero.titleWithGreeting', { firstName: profile.firstName })
    : t('profile.hero.title');

  return (
    <PageSection
      korosBottom
      korosBottomClassName={styles.heroKoros}
      className={styles.heroSection}
      aria-label={title}
    >
      <ContentContainer className={styles.contentContainer}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>
          {t('profile.hero.description')}
        </p>
      </ContentContainer>
    </PageSection>
  );
};

export default ProfileHero;
