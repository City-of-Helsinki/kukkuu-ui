import * as React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line max-len
import { profileQuery_myProfile_children_edges_node as ChildType } from '../../../api/generatedTypes/profileQuery';
import Icon from '../../../../common/components/icon/Icon';
import birthdayIcon from '../../../../assets/icons/svg/birthdayCake.svg';
import angleDownIcon from '../../../../assets/icons/svg/angleDown.svg';
import childIcon from '../../../../assets/icons/svg/childFaceHappy.svg';
import styles from './profileChild.module.scss';
import { formatTime, newMoment } from '../../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';

interface ProfileChildProps {
  child: ChildType;
}

const ProfileChild: React.FunctionComponent<ProfileChildProps> = ({
  child,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  // Change to child.availableEvents when API supports it. Change to true to test.
  const availableEvents = child.availableEvents?.edges[0]?.node?.name;
  const isNamed = Boolean(child.firstName);
  const childName = `${child.firstName} ${child.lastName}`;

  return (
    <button
      className={styles.childWrapper}
      onClick={() => history.push(`/profile/child/${child.id}`)}
    >
      {availableEvents && (
        <div className={styles.invitationLabel}>
          {t('profile.child.invitationLabel.text')}
        </div>
      )}
      <div className={styles.child} role="listitem">
        <div className={styles.childIcon}>
          <Icon src={childIcon} alt={t('profile.child.default.name.text')} />
        </div>
        <div className={styles.childInfo}>
          <h3>{isNamed ? childName : t('profile.child.default.name.text')}</h3>
          <div className={styles.childBirthdate}>
            <Icon
              src={birthdayIcon}
              alt={t('profile.child.detail.birthdate')}
            />
            <span>
              {formatTime(newMoment(child.birthdate), DEFAULT_DATE_FORMAT)}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.childDetail}>
        <Icon
          src={angleDownIcon}
          alt={t('profile.child.navigateToDetail.buttonLabel')}
        />
      </div>
    </button>
  );
};

export default ProfileChild;
