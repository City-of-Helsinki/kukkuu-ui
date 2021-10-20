import { useTranslation } from 'react-i18next';
import 'hds-core/lib/components/button/button.css';

import styles from './giveFeedbackButton.module.scss';

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
      <a href={t('feedback.giveFeedback.link')} className={buttonClassName}>
        {t('feedback.giveFeedback.label')}
      </a>
    </div>
  );
};

export default GiveFeedbackButton;
