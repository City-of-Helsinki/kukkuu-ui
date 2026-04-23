import { toast } from 'react-toastify';
import type { UnknownAction } from 'redux';

import Icon from '../../../common/components/icon/Icon';
import { publicSvgIconPaths } from '../../../public_files';
import styles from './enrol.module.scss';
import { EnrolOccurrenceMutation } from '../../api/generatedTypes/graphql';
import { saveChildEvents } from '../state/EventActions';

type EnrolCompletedDeps = {
  childId: string;
  dispatch: (action: UnknownAction) => void;
  refetchProfile: () => Promise<void>;
  goToOccurrence: () => void;
  t: (key: string) => string;
};

export async function handleEnrolCompleted(
  data: EnrolOccurrenceMutation | null | undefined,
  { childId, dispatch, refetchProfile, goToOccurrence, t }: EnrolCompletedDeps
) {
  if (data?.enrolOccurrence?.enrolment?.child?.occurrences?.edges) {
    dispatch(
      saveChildEvents({
        childId,
        occurrences: data.enrolOccurrence.enrolment.child.occurrences,
      })
    );
    toast.success(
      <div>
        <Icon src={publicSvgIconPaths['tada']} className={styles.tadaIcon} />
        <h1>{t('enrollment.successToast.heading')}</h1>
        <p>{t('enrollment.successToast.paragraph')}</p>
      </div>
    );
  }

  await refetchProfile();
  goToOccurrence();
}
