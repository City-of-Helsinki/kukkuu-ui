import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './footer.module.scss';
import Container from '../layout/Container';

const Footer: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footerWrapper}>
      <Container>
        <div className={styles.footer}>
          <div className={styles.helsinkiLogo}></div>
          <div className={styles.copyright}>
            <p>{t('footer.copyrightText')}</p>
          </div>
          <div className={styles.links}>
            <a href="/accessibility">{t('accessibilityStatement.title')}</a> •{' '}
            <a href="/terms">{t('termsOfService.title')}</a> •{' '}
            <a href={t('descriptionOfTheFile.url')}>
              {t('descriptionOfTheFile.title')}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
