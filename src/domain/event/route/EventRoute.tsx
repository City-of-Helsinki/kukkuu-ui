import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Event from '../Event';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

const EventRoute: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  return (
    <Switch>
      <Route
        exact
        component={Event}
        path={`/${currentLocale}/event/:eventId`}
      />
    </Switch>
  );
};
export default EventRoute;
