import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPresetTheme } from 'hds-react';

import styles from './homeInstructions.module.scss';
import InstructionSection from './InstructionSection';
import LinkButton from '../../../common/components/button/LinkButton';
import { publicSvgIconPaths } from '../../../public_files';

const HomeInstructions: React.FC = () => {
  const { t } = useTranslation();

  const section1Cards = [
    {
      icon: publicSvgIconPaths.homeAge,
      circleVariant: 'yellow' as const,
      title: t('home.instructions.section1.cards.age.title'),
      text: t('home.instructions.section1.cards.age.text'),
    },
    {
      icon: publicSvgIconPaths.homeTicket,
      circleVariant: 'yellow' as const,
      title: t('home.instructions.section1.cards.ticket.title'),
      text: t('home.instructions.section1.cards.ticket.text'),
    },
    {
      icon: publicSvgIconPaths.homeGrowth,
      circleVariant: 'yellow' as const,
      title: t('home.instructions.section1.cards.growth.title'),
      text: t('home.instructions.section1.cards.growth.text'),
    },
  ];

  const section2Cards = [
    {
      icon: publicSvgIconPaths.homeThemes,
      circleVariant: 'silver' as const,
      title: t('home.instructions.section2.cards.themes.title'),
      text: t('home.instructions.section2.cards.themes.text'),
    },
    {
      icon: publicSvgIconPaths.homeFamilies,
      circleVariant: 'silver' as const,
      title: t('home.instructions.section2.cards.families.title'),
      text: t('home.instructions.section2.cards.families.text'),
    },
    {
      icon: publicSvgIconPaths.homeIntro,
      circleVariant: 'silver' as const,
      title: t('home.instructions.section2.cards.intro.title'),
      text: t('home.instructions.section2.cards.intro.text'),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <InstructionSection
          heading={t('home.instructions.section1.heading')}
          cards={section1Cards}
          className={styles.sectionSpacing}
        />
        <InstructionSection
          heading={t('home.instructions.section2.heading')}
          cards={section2Cards}
          className={styles.sectionSpacing}
          action={
            <LinkButton
              variant="secondary"
              theme={ButtonPresetTheme.Black}
              to={t('home.instructions.moreLanguagesButton.url')}
              className={styles.languageButton}
            >
              {t('home.instructions.moreLanguagesButton.text')}
            </LinkButton>
          }
        />
      </div>
    </div>
  );
};

export default HomeInstructions;
