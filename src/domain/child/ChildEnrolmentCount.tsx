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
    convenience: { areAllCurrentEnrolmentsUsed },
  } = useChildEnrolmentCount({
    variables: {
      childId,
    },
  });

  const enrolmentsUsed = data?.child?.enrolmentCount ?? ' ';
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
      variant={areAllCurrentEnrolmentsUsed ? 'success' : 'default'}
      iconLeft={areAllCurrentEnrolmentsUsed && <IconCheck />}
      name={
        <>
          {t('child.message.eventVisitsThisYear')}:{' '}
          {data ? enrolmentsUsed : loadingSpinner}
        </>
      }
    />
  );
}
