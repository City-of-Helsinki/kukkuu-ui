import React, { FunctionComponent } from 'react';
import { Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import AppRoute from '../../app/AppRoute';
import Event from '../Event';

const EventRoute: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  return (
    <Switch>
      <AppRoute
        noTitle
        exact
        component={Event}
        path={`/${currentLocale}/event/:eventId`}
      />
    </Switch>
  );
};
export default EventRoute;
