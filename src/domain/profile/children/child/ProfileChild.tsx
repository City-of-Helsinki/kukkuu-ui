import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconAngleRight } from 'hds-react';

import childIcon from '../../../../assets/icons/svg/childFaceHappy.svg';
import Icon from '../../../../common/components/icon/Icon';
import Text from '../../../../common/components/text/Text';
import { newMoment } from '../../../../common/time/utils';
import {
  profileQuery_myProfile_children_edges_node as ChildType,
  profileQuery_myProfile_children_edges_node_enrolments_edges_node as EnrolmentType,
} from '../../../api/generatedTypes/profileQuery';
import ChildEnrolmentCount from '../../../child/ChildEnrolmentCount';
import ProfileChildEnrolment from './ProfileChildEnrolment';
import styles from './profileChild.module.scss';
import useChildEnrolmentCount from '../../../child/useChildEnrolmentCount';

interface ProfileChildProps {
  child: ChildType;
}

const ProfileChild: React.FunctionComponent<ProfileChildProps> = ({
  child,
}) => {
  const linkRef = React.useRef<HTMLAnchorElement | null>(null);
  const downRef = React.useRef<Date | null>(null);
  const { t } = useTranslation();
  const { data } = useChildEnrolmentCount({
    variables: {
      childId: child.id,
    },
  });

  // Change to child.availableEvents when API supports it. Change to true to test.
  const availableEvents = child.availableEvents?.edges[0]?.node?.name;
  const isNamed = Boolean(child.firstName);
  const childName = `${child.firstName} ${child.lastName}`;
  const enrolments = child.enrolments?.edges
    ?.map((edge) => edge?.node)
    ?.filter((node): node is EnrolmentType => {
      const now = new Date();
      const occurrenceTimeDate = new Date(node?.occurrence.time);

      return Boolean(node) && occurrenceTimeDate.getTime() >= now.getTime();
    });
  const nextEnrolment = enrolments ? findNextEnrolment(enrolments) : null;

  const handleWrapperMouseDown = () => {
    downRef.current = new Date();
  };

  const handleWrapperMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    const link = linkRef.current;
    const mouseDownTime = downRef?.current;
    const up = new Date();

    // Invoke a click on link if
    // 1. The event did not bubble from the link itself
    // 2. The user is not attempting to select text
    if (
      mouseDownTime &&
      link &&
      link !== e.target &&
      up.getTime() - mouseDownTime.getTime() < 200
    ) {
      link.click();
    }
  };

  return (
    <div
      onMouseDown={handleWrapperMouseDown}
      onMouseUp={handleWrapperMouseUp}
      className={styles.container}
    >
      <Icon
        src={childIcon}
        alt={t('profile.child.default.name.text')}
        className={styles.icon}
      />
      <div className={styles.content}>
        <Text variant="h4" className={styles.title}>
          {isNamed ? childName : t('profile.child.default.name.text')}
        </Text>
        <div className={styles.contentStack}>
          <Content
            hasEnrolment={Boolean(nextEnrolment)}
            enrolmentCount={data?.child?.pastEnrolmentCount}
            maxEnrolmentCount={data?.child?.project?.enrolmentLimit}
            hasInvitation={Boolean(availableEvents)}
          />
          {nextEnrolment && (
            <ProfileChildEnrolment
              enrolment={nextEnrolment}
              childId={child.id}
            />
          )}
        </div>
        <div className={styles.additionalDetails}>
          {availableEvents && (
            <div className={styles.invitationLabel}>
              {t('profile.child.invitationLabel.text')}
            </div>
          )}
          <ChildEnrolmentCount childId={child.id} />
        </div>
      </div>
      <Link
        className={styles.readMoreLink}
        ref={linkRef}
        to={`/profile/child/${child.id}`}
      >
        <IconAngleRight
          aria-label={t('profile.child.navigateToDetail.buttonLabel')}
        />
      </Link>
    </div>
  );
};

type ContentProps = {
  maxEnrolmentCount?: number | null;
  enrolmentCount?: number | null;
  hasInvitation?: boolean | null;
  hasEnrolment?: boolean | null;
};

function Content({
  maxEnrolmentCount,
  enrolmentCount,
  hasInvitation,
  hasEnrolment,
}: ContentProps) {
  const { t } = useTranslation();

  if (hasEnrolment) {
    return (
      <Text className={styles.contentDescription}>
        {t('profile.message.youAreEnrolled')}
      </Text>
    );
  }

  if (
    getIsNotEmpty(enrolmentCount) &&
    getIsNotEmpty(maxEnrolmentCount) &&
    enrolmentCount >= maxEnrolmentCount
  ) {
    return (
      <Text className={styles.contentDescription}>
        {t('profile.message.allSignupsSpent')}
      </Text>
    );
  }

  if (hasInvitation) {
    return (
      <Text className={styles.contentDescription}>
        {t('profile.message.enrollToEvent')}
      </Text>
    );
  }

  return null;
}

function getIsNotEmpty<V>(val: V): val is Exclude<V, undefined | null> {
  return typeof val !== undefined || val !== null;
}

function findNextEnrolment(enrolments: EnrolmentType[]) {
  return enrolments.reduce((incumbent: EnrolmentType | null, enrolment) => {
    if (!incumbent) {
      return enrolment;
    }

    const now = newMoment(new Date());
    const untilIncumbent = now.diff(newMoment(incumbent.occurrence.time));
    const untilEnrolment = now.diff(newMoment(enrolment.occurrence.time));

    return untilIncumbent < untilEnrolment ? enrolment : incumbent;
  }, null);
}

export default ProfileChild;
