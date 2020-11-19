import React from 'react';
import { useTranslation } from 'react-i18next';
import 'hds-core/lib/components/button/button.css';

import styles from './giveFeedbackButton.module.scss';

const feedbackFormLink =
  // eslint-disable-next-line max-len
  'https://docs.google.com/forms/d/e/1FAIpQLSdqw2Lq3qooEeRdgr0sV0-Wv-4XcV7IZVzq1HuWoLRa2M7tEg/viewform?usp=pp_url&entry.1982410290=Kulttuurin+kummilapset';

const buttonClassName = [
  'hds-button',
  'hds-button--secondary',
  'hds-button__label',
  'hds-button--theme-black',
  styles.buttonLink,
].join(' ');

const GiveFeedbackButton = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <a href={feedbackFormLink} className={buttonClassName}>
        {t('feedback.giveFeedback.label')}
      </a>
    </div>
  );
};

export default GiveFeedbackButton;
