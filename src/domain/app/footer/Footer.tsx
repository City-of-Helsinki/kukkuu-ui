import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';
import { useMenuQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { Logo, Footer as HDSFooter, logoSv, logoFi, LogoSize } from 'hds-react';

import styles from './footer.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { RESET_FOCUS_ID } from '../../../common/components/resetFocus/constants';
import {
  FooterPillSkeleton,
  SkeletonLoader,
} from '../../../common/components/skeleton/CmsSkeleton';
import { useCmsLoadingState } from '../../../hooks/useCmsLoadingState';
import AppConfig from '../AppConfig';
import CimodeToggle from './CimodeToggle';

type ValidMenuItem = {
  id: MenuItem['id'];
  label: NonNullable<MenuItem['label']>;
  path: NonNullable<MenuItem['path']>;
};

const isValidMenuItem = (menuItem: MenuItem): menuItem is ValidMenuItem =>
  !!menuItem.label && !!menuItem.path;

const Footer: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    globalThis.window?.scrollTo({ top: 0 });
    document.querySelector<HTMLDivElement>(`#${RESET_FOCUS_ID}`)?.focus();
  };

  const footerMenuQuery = useMenuQuery({
    variables: {
      id: AppConfig.cmsFooterMenuNames[currentLocale],
      menuIdentifiersOnly: true,
    },
  });
  const { isInitialLoading: isFooterLoading } =
    useCmsLoadingState(footerMenuQuery);
  const footerLinks =
    footerMenuQuery.data?.menu?.menuItems?.nodes?.filter(isValidMenuItem) ?? [];

  return (
    <HDSFooter title={t('appName')} className={styles.footer}>
      <HDSFooter.Base
        copyrightHolder={t('common.cityOfHelsinki')}
        logo={
          <Logo
            src={currentLocale === 'sv' ? logoSv : logoFi}
            size={LogoSize.Medium}
            alt={t('common.cityOfHelsinki')}
          />
        }
        backToTopLabel={t('footer.backToTop')}
        onBackToTopClick={handleBackToTop}
      >
        <SkeletonLoader
          isLoading={isFooterLoading}
          skeleton={
            <div
              className={styles.footerSkeletonWrapper}
              aria-busy="true"
              data-testid="footer-skeleton-wrapper"
            >
              <FooterPillSkeleton width="6rem" />
              <FooterPillSkeleton width="8rem" />
              <FooterPillSkeleton width="7rem" />
            </div>
          }
          as={null}
        >
          {footerLinks.map((footerLink) => (
            <HDSFooter.Link
              key={footerLink.id}
              href={footerLink.path}
              label={footerLink.label}
            />
          ))}
        </SkeletonLoader>
        {AppConfig.translationToolEnabled && (
          <HDSFooter.Link as={CimodeToggle} />
        )}
      </HDSFooter.Base>
    </HDSFooter>
  );
};

export default Footer;
