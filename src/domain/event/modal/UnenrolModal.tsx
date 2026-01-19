import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
// TODO: KK-300 Check how the cancel button should look
// TODO: KK-300 If the same, find a better/reusable location for this css module
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import unenrolOccurrenceMutation from '../mutations/unenrolOccurrenceMutation';
import {
  UnenrolOccurrenceMutation,
  UnenrolOccurrenceMutationVariables,
} from '../../api/generatedTypes/graphql';
import ConfirmModal from '../../../common/components/confirm/ConfirmModal';
import { saveChildEvents } from '../state/EventActions';
import getEventOrEventGroupOccurrenceRefetchQueries from '../getEventOrEventGroupOccurrenceRefetchQueries';
import AppConfig from '../../app/AppConfig';
import graphqlClient from '../../api/client';

interface UnenrolModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  childId: string;
  occurrenceId: string;
  eventGroupId?: string;
}

const UnenrolModal = ({
  isOpen,
  setIsOpen,
  childId,
  occurrenceId,
  eventGroupId,
}: UnenrolModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getPathname = useGetPathname();

  const [unenrolOccurrence] = useMutation<
    UnenrolOccurrenceMutation,
    UnenrolOccurrenceMutationVariables
  >(unenrolOccurrenceMutation, {
    client: graphqlClient,
    refetchQueries: getEventOrEventGroupOccurrenceRefetchQueries({
      childId,
      eventGroupId,
    }),
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data.unenrolOccurrence?.child?.occurrences.edges) {
        dispatch(
          saveChildEvents({
            childId: data.unenrolOccurrence.child.id,
            occurrences: data.unenrolOccurrence.child.occurrences,
          })
        );
      }
      navigate(getPathname(`/profile/child/${childId}`), { replace: true });
    },
  });

  const unenrol = async () => {
    try {
      await unenrolOccurrence({
        variables: {
          input: {
            occurrenceId: occurrenceId,
            childId: childId,
          },
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: KK-280 Handle errors nicely
      toast.error(t('registration.submitMutation.errorMessage'));
    }
  };

  const confirmUnenrol = (answer: boolean) => {
    if (answer === true) unenrol();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      heading={t('event.cancellation.confirmationModal.heading')}
      cancel={t('event.cancellation.confirmationModal.cancel.buttonText')}
      ok={t('event.cancellation.confirmationModal.confirm.buttonText')}
      answer={confirmUnenrol}
    >
      <p>
        {t('enrollment.cancellation.enabledDescription', {
          unerolHoursBeforeOccurrence:
            AppConfig.enrolmentCancellationTimeLimitHours,
        })}
      </p>
    </ConfirmModal>
  );
};

export default UnenrolModal;
