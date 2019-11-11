import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

const NotFound: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <p>{t('notFound.text')}</p>
    </div>
  );
};

export default NotFound;
