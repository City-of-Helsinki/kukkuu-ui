import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconAngleRight } from 'hds-react';
import { differenceInMilliseconds } from 'date-fns';

import Icon from '../../../../common/components/icon/Icon';
import Text from '../../../../common/components/text/Text';
import { newDate } from '../../../../common/time/utils';
import useGetPathname from '../../../../common/route/utils/useGetPathname';
import ChildEnrolmentCount from '../../../child/ChildEnrolmentCount';
import useChildEnrolmentCount from '../../../child/useChildEnrolmentCount';
import ChildEventInvitationLabel from '../../../child/ChildEventInvitationLabel';
import ProfileChildEnrolment from './ProfileChildEnrolment';
import styles from './profileChild.module.scss';
import {
  MyProfileChild,
  MyProfileEnrolment,
} from '../../types/ProfileQueryTypes';
import { publicSvgIconPaths } from '../../../../public_files';

interface ProfileChildProps {
  child: MyProfileChild;
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
  const getPathname = useGetPathname();

  const upcomingEventsAndEventGroups =
    child.upcomingEventsAndEventGroups?.edges[0]?.node?.name;
  const name = child.name.split(' ');
  const isNamed = !!name;
  const childName = child.name;
  const enrolments = child.enrolments?.edges
    ?.map((edge) => edge?.node)
    ?.filter((node): node is MyProfileEnrolment => {
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
    // FIXME: Make ProfileChild accessible with keyboard & re-enable linting:
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={handleWrapperMouseDown}
      onMouseUp={handleWrapperMouseUp}
      className={styles.container}
    >
      <Icon
        src={publicSvgIconPaths['childFaceHappy']}
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
            hasInvitation={Boolean(upcomingEventsAndEventGroups)}
          />
          {nextEnrolment && (
            <ProfileChildEnrolment
              enrolment={nextEnrolment}
              childId={child.id}
            />
          )}
        </div>
        <div className={styles.additionalDetails}>
          <ChildEventInvitationLabel childId={child.id} />
          <ChildEnrolmentCount childId={child.id} />
        </div>
      </div>
      <Link
        className={styles.readMoreLink}
        ref={linkRef}
        to={getPathname(`/profile/child/${child.id}`)}
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
  return typeof val !== 'undefined' || val !== null;
}

function findNextEnrolment(enrolments: MyProfileEnrolment[]) {
  return enrolments.reduce(
    (incumbent: MyProfileEnrolment | null, enrolment) => {
      if (!incumbent) {
        return enrolment;
      }

      const now = newDate();
      const untilIncumbent = differenceInMilliseconds(
        newDate(incumbent.occurrence.time),
        now
      );
      const untilEnrolment = differenceInMilliseconds(
        newDate(enrolment.occurrence.time),
        now
      );

      return untilIncumbent < untilEnrolment ? enrolment : incumbent;
    },
    null
  );
}

export default ProfileChild;
