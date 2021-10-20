import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './accessibilityStatement.module.scss';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import AccessibilityStatementEn from './AccessibilityStatementEn';
import AccessibilityStatementFi from './AccessibilityStatementFi';
import AccessibilityStatementSv from './AccessibilityStatementSv';
import PageWrapper from '../app/layout/PageWrapper';

type StatementProps = {
  lang: string;
};

const Statement: FunctionComponent<StatementProps> = (props) => {
  const lang = props.lang;
  switch (lang) {
    case 'en':
      return <AccessibilityStatementEn />;
    case 'fi':
      return <AccessibilityStatementFi />;
    case 'sv':
      return <AccessibilityStatementSv />;
    default:
      return <p>Invalid language.</p>;
  }
};

const AccessibilityStatement: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const locale = getCurrentLanguage(i18n);

  return (
    <PageWrapper>
      <div className={styles.accessibilityStatement}>
        <Statement lang={locale} />
      </div>
    </PageWrapper>
  );
};

export default AccessibilityStatement;
