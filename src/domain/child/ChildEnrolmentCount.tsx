import { useTranslation } from 'react-i18next';
import { IconCheck } from 'hds-react';
import { useQuery } from '@apollo/client';

import {
  ChildEnrolmentCount as ChildEnrolmentCountQuery,
  ChildEnrolmentCountVariables as ChildEnrolmentCountVariablesQuery,
} from '../api/generatedTypes/childEnrolmentCount';
import KukkuuPill from '../../common/components/kukkuuPill/KukkuuPill';
import { childEnrolmentCountQuery } from './queries/ChildEnrolmentCountQuery';

type Props = {
  childId: string;
};

export default function ChildEnrolmentCount({ childId }: Props) {
  const { t } = useTranslation();
  const { data } = useQuery<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountVariablesQuery
  >(childEnrolmentCountQuery, {
    variables: {
      childId,
    },
  });

  const pastEnrolmentCount = data?.child?.pastEnrolmentCount ?? ' ';
  const enrolmentLimit = data?.child?.project?.enrolmentLimit ?? ' ';
  const areAllEnrolmentsUsed = data && pastEnrolmentCount === enrolmentLimit;

  return (
    <KukkuuPill
      variant={areAllEnrolmentsUsed ? 'success' : 'default'}
      iconLeft={areAllEnrolmentsUsed && <IconCheck />}
      name={t('child.message.eventVisitsThisYear', {
        eventVisitCount: pastEnrolmentCount,
        allowedEventVisitCount: enrolmentLimit,
      })}
    />
  );
}
