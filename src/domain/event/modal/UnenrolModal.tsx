import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
// TODO: KK-300 Check how the cancel button should look
// TODO: KK-300 If the same, find a better/reusable location for this css module
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import unenrolOccurrenceMutation from '../mutations/unenrolOccurrenceMutation';
import profileQuery from '../../profile/queries/ProfileQuery';
import { unenrolOccurrenceMutationVariables } from '../../api/generatedTypes/unenrolOccurrenceMutation';
import ConfirmModal from '../../../common/components/confirm/ConfirmModal';
import { unenrolChild } from '../state/EventActions';

interface UnenrolModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  childId: string;
  occurrenceId: string;
  eventId: string;
}

const UnenrolModal: FunctionComponent<UnenrolModalProps> = ({
  isOpen,
  setIsOpen,
  childId,
  occurrenceId,
  eventId,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [unenrolOccurrence] = useMutation<unenrolOccurrenceMutationVariables>(
    unenrolOccurrenceMutation,
    {
      // FIXME: Prevent crash after unenrol:
      // Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
      //refetchQueries: [{ query: profileQuery }],
      onCompleted: () => {
        console.log('completed');
        dispatch(unenrolChild({ childId, eventId }));
      },
    }
  );

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
      history.replace(`/profile/child/${childId}`);
    } catch (error) {
      // TODO: KK-280 Handle errors nicely
      toast(t('registration.submitMutation.errorMessage'), {
        type: toast.TYPE.ERROR,
      });
      console.error(error);
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
    />
  );
};

export default UnenrolModal;
