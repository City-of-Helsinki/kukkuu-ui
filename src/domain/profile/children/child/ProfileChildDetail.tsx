import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { IconPen } from 'hds-react';

import { EditChildPayload } from '../../../child/types/UpdateChildMutationTypes';
import { DeleteChildPayload } from '../../../child/types/DeleteChildMutationTypes';
import {
  UpdateChildMutationInput,
  ChildByIdQuery,
} from '../../../api/generatedTypes/graphql';
import GiveFeedbackButton from '../../../../common/components/giveFeedbackButton/GiveFeedbackButton';
import ErrorMessage from '../../../../common/components/error/Error';
import Button from '../../../../common/components/button/Button';
import LoadingSpinner from '../../../../common/components/spinner/LoadingSpinner';
import Text from '../../../../common/components/text/Text';
import useGetPathname from '../../../../common/route/utils/useGetPathname';
import {
  deleteChildMutation,
  editChildMutation,
} from '../../../child/mutation/ChildMutation';
import { childByIdQuery } from '../../../child/queries/ChildQueries';
import ChildEnrolmentCount from '../../../child/ChildEnrolmentCount';
import ListPageLayout from '../../../app/layout/ListPageLayout';
import ProfileEvents from '../../events/ProfileEvents';
import profileQuery from '../../queries/ProfileQuery';
import ProfileChildDetailEditModal from './modal/ProfileChildDetailEditModal';
import styles from './profileChildDetail.module.scss';
import useAppRouteHref from '../../../app/useAppRouteHref';

export type ChildDetailEditModalPayload = Omit<UpdateChildMutationInput, 'id'>;

export const useProfileRouteGoBackTo = () => {
  return useAppRouteHref('/profile');
};

export const useChildRouteGoBackTo = () => {
  const { childId } = useParams<{ childId: string }>();
  const profileUrl = useProfileRouteGoBackTo();
  return `${profileUrl}/child/${childId}`;
};

const ProfileChildDetail = () => {
  const { t } = useTranslation();
  const params = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const goBackTo = useProfileRouteGoBackTo();
  const { loading, error, data } = useQuery<ChildByIdQuery>(childByIdQuery, {
    variables: {
      id: params.childId,
    },
  });
  const getPathname = useGetPathname();

  const [deleteChild] = useMutation<DeleteChildPayload>(deleteChildMutation, {
    refetchQueries: [{ query: profileQuery }],
  });

  const [editChild] = useMutation<EditChildPayload>(editChildMutation, {
    refetchQueries: [
      { query: childByIdQuery, variables: { id: params.childId } },
    ],
  });

  const [isOpen, setIsOpen] = useState(false);
  if (loading) {
    return <LoadingSpinner isLoading={true} />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error);
    return <ErrorMessage message={t('api.errorMessage')} />;
  }

  const child = data?.child;

  return (
    <ListPageLayout>
      {child ? (
        <>
          <ListPageLayout.Header
            title={
              child.firstName
                ? `${child.firstName} ${child.lastName}`
                : t('profile.child.default.name.text')
            }
            content={
              <Text variant="body-l">
                {t('profile.common.message.serviceDescription')}
              </Text>
            }
            actions={
              <>
                <ChildEnrolmentCount childId={child.id} />
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(true)}
                  iconLeft={<IconPen />}
                >
                  {t('profile.edit.button.text')}
                </Button>
              </>
            }
            backButtonHref={goBackTo}
          />
          {isOpen && (
            <ProfileChildDetailEditModal
              setIsOpen={setIsOpen}
              childBeingEdited={child}
              editChild={async (payload: ChildDetailEditModalPayload) => {
                try {
                  await editChild({
                    variables: {
                      input: {
                        id: child.id,
                        ...payload,
                      },
                    },
                  });
                } catch (error) {
                  toast.error(t('registration.submitMutation.errorMessage'));
                  Sentry.captureException(error);
                }
              }}
              deleteChild={async () => {
                try {
                  const res = await deleteChild({
                    variables: {
                      input: {
                        id: child.id,
                      },
                    },
                  });

                  if (res) {
                    navigate(getPathname('/profile'));
                  }
                } catch (error) {
                  toast.error(t('registration.submitMutation.errorMessage'));
                  Sentry.captureException(error);
                }
              }}
            />
          )}
          <ProfileEvents child={child} />
        </>
      ) : (
        <div className={styles.noChild}>
          <p>{t('profile.children.noChild.text')}</p>
        </div>
      )}
      <GiveFeedbackButton />
    </ListPageLayout>
  );
};

export default ProfileChildDetail;
