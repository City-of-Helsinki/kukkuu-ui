import { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import { IconArrowRight, Link } from 'hds-react';

import Icon from '../../../common/components/icon/Icon';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import styles from './profileNoEvent.module.scss';
import { publicSvgIconPaths } from '../../../public_files';

interface ProfileNoEventProps {
  childId?: string;
}

const ProfileNoEvent: FunctionComponent<ProfileNoEventProps> = ({ childId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const browseEventsUrl = childId
    ? getPathname(`/profile/child/${childId}/events`)
    : undefined;

  return (
    <div className={styles.noEventWrapper}>
      <h2>{t('profile.noupcomingevents.hero.heading')}</h2>
      <div className={styles.noEvent}>
        <Icon
          src={publicSvgIconPaths['envelopeWithStars']}
          className={styles.envelopIcon}
        />
        <p>
          <Trans i18nKey="multiline">
            {t('profile.noupcomingevents.text')}
          </Trans>
        </p>
      </div>
      {browseEventsUrl && (
        <div className={styles.browseEventsLinkWrapper}>
          <Link
            href={browseEventsUrl}
            disableVisitedStyles
            iconEnd={<IconArrowRight aria-hidden="true" />}
            onClick={(e) => {
              e.preventDefault();
              navigate(browseEventsUrl);
            }}
          >
            {t('profile.child.browseEventsButton')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileNoEvent;
