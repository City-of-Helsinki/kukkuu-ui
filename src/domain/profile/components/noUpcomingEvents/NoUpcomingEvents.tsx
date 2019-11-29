import React, { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import Icon from '../../../../common/components/icon/Icon';
import envelopeWithStars from '../../../../assets/icons/svg/envelopeWithStars.svg';

const NoUpcomingEvents: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('profile.noupcomingevents.hero.heading')}</h1>
      <Icon src={envelopeWithStars} alt="Envelope with stars" />
      <Trans i18nKey="multiline">{t('profile.noupcomingevents.text')}</Trans>
      <p></p>
    </div>
  );
};

export default NoUpcomingEvents;
