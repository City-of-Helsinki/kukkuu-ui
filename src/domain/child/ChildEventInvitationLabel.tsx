import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import {
  ChildEventInvitationLabelQuery,
  ChildEventInvitationLabelQueryVariables,
} from '../api/generatedTypes/graphql';
import { childEventInvitationLabelQuery } from './queries/ChildEventInvitationLabelQuery';
import useChildEnrolmentCount from './useChildEnrolmentCount';
import styles from './childEventInvitationLabel.module.scss';

type Props = {
  childId: string;
};

export default function ChildEventInvitationLabel({ childId }: Props) {
  const { t } = useTranslation();
  const { data } = useQuery<
    ChildEventInvitationLabelQuery,
    ChildEventInvitationLabelQueryVariables
  >(childEventInvitationLabelQuery, {
    variables: {
      childId,
    },
  });
  const {
    convenience: { areAllCurrentEnrolmentsUsed },
  } = useChildEnrolmentCount({
    variables: {
      childId,
    },
  });

  console.log(data?.child);

  const upcomingEventsWhereChildCanEnrol =
    data?.child?.upcomingEventsAndEventGroups?.edges?.map(
      (edge) => edge?.node?.canChildEnroll
    ) ?? [];
  const hasUpcomingEventsWhereChildCanEnrol =
    (upcomingEventsWhereChildCanEnrol?.length ?? 0) > 0;

  if (!hasUpcomingEventsWhereChildCanEnrol || areAllCurrentEnrolmentsUsed) {
    return null;
  }

  return (
    <div className={styles.invitationLabel}>
      {t('profile.child.invitationLabel.text')}
    </div>
  );
}
