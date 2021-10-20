import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import joinClassNames from 'classnames';
import { Koros } from 'hds-react';

import styles from './footer.module.scss';
import Container from '../layout/Container';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

const Footer: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const logoLang = currentLocale === 'sv' ? styles.sv : styles.fi;

  return (
    <div className={styles.footerWrapper}>
      <Koros className={styles.koros} />
      <Container>
        <div className={styles.footer}>
          <div className={joinClassNames(styles.helsinkiLogo, logoLang)}></div>
          <div className={styles.copyright}>
            <p>{t('footer.copyrightText')}</p>
          </div>
          <div className={styles.links}>
            <Link to="/accessibility#start">
              {t('accessibilityStatement.title')}
            </Link>{' '}
            • <Link to="/terms#">{t('termsOfService.title')}</Link> •{' '}
            <a
              href={t('descriptionOfTheFile.url')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('descriptionOfTheFile.title')}
            </a>{' '}
            •{' '}
            <a href={t('dataProtection.url')} rel="noopener noreferrer">
              {t('dataProtection.title')}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
