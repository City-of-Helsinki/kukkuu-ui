import { useTranslation } from 'react-i18next';
import { IconCheck, LoadingSpinner } from 'hds-react';
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
  const enrolmentsUsed = `${pastEnrolmentCount}/${enrolmentLimit}`;
  const loadingSpinner = (
    <LoadingSpinner
      theme={{
        '--spinner-color': 'var(--color-black)',
      }}
      small
    />
  );

  return (
    <KukkuuPill
      variant={areAllEnrolmentsUsed ? 'success' : 'default'}
      iconLeft={areAllEnrolmentsUsed && <IconCheck />}
      name={
        <>
          {t('child.message.eventVisitsThisYear')}:{' '}
          {data ? enrolmentsUsed : loadingSpinner}
        </>
      }
    />
  );
}