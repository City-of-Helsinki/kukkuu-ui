import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPresetTheme, IconSearch } from 'hds-react';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { MyProfile } from '../types/ProfileQueryTypes';
import styles from './profileHero.module.scss';

export interface ProfileHeroProps {
  profile?: MyProfile | null;
  title?: string;
  description?: string;
}

/**
 * Hero section for the guardian Profile page.
 *
 * Displays a greeting heading, description, and an event search button (when the guardian has children).
 *
 * @param props - ProfileHeroProps with profile and optional CMS overrides.
 */
const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  title: propTitle,
  description: propDescription,
}) => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  const title =
    propTitle ||
    (profile?.firstName
      ? t('profile.hero.titleWithGreeting', { firstName: profile.firstName })
      : t('profile.hero.title'));

  const description =
    propDescription !== undefined
      ? propDescription
      : t('profile.hero.description');

  const hasChildren = (profile?.children?.edges?.length ?? 0) > 0;

  return (
    <PageSection
      korosBottom
      korosBottomClassName={styles.heroKoros}
      className={styles.heroSection}
      aria-label={title}
    >
      <ContentContainer className={styles.contentContainer}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {hasChildren && (
          <div className={styles.buttonWrapper}>
            <LinkButton
              to={getPathname('/events')}
              variant="primary"
              theme={ButtonPresetTheme.Black}
              iconStart={<IconSearch aria-hidden="true" />}
            >
              {t('profile.events.searchButton', 'Etsi tapahtumia')}
            </LinkButton>
          </div>
        )}
      </ContentContainer>
    </PageSection>
  );
};

export default ProfileHero;
