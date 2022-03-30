import { useTranslation } from 'react-i18next';
import { IconCheck, LoadingSpinner } from 'hds-react';

import KukkuuPill from '../../common/components/kukkuuPill/KukkuuPill';
import useChildEnrolmentCount from './useChildEnrolmentCount';

type Props = {
  childId: string;
};

export default function ChildEnrolmentCount({ childId }: Props) {
  const { t } = useTranslation();
  const {
    data,
    convenience: { areAllEnrollmentsUsed },
  } = useChildEnrolmentCount({
    variables: {
      childId,
    },
  });

  const pastEnrolmentCount = data?.child?.pastEnrolmentCount ?? ' ';
  const enrolmentLimit = data?.child?.project?.enrolmentLimit ?? ' ';
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
      variant={areAllEnrollmentsUsed ? 'success' : 'default'}
      iconLeft={areAllEnrollmentsUsed && <IconCheck />}
      name={
        <>
          {t('child.message.eventVisitsThisYear')}:{' '}
          {data ? enrolmentsUsed : loadingSpinner}
        </>
      }
    />
  );
}
