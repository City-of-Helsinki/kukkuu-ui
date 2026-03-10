import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { IconPen } from 'hds-react';

import {
  ChildByIdQuery,
  UpdateChildMutationPayloadFieldsFragment,
  DeleteChildMutationPayloadFieldsFragment,
  ProfileQueryDocument,
} from '../../../api/generatedTypes/graphql';
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
import ProfileChildDetailEditModal from './modal/ProfileChildDetailEditModal';
import styles from './profileChildDetail.module.scss';
import { useProfileContext } from '../../hooks/useProfileContext';
import AdditionalNotesCard from '../../events/AdditionalNotesCard';
import type { ChildDetailEditModalPayload } from './types';
import useProfileRouteGoBackTo from './useProfileRouteGoBackTo';
import graphqlClient from '../../../api/client';

const ProfileChildDetail = () => {
  const { t } = useTranslation();
  const params = useParams<{ childId: string }>();
  const { refetchProfile } = useProfileContext();
  const navigate = useNavigate();
  const goBackTo = useProfileRouteGoBackTo();
  const { profile } = useProfileContext();

  const { loading, error, data } = useQuery<ChildByIdQuery>(childByIdQuery, {
    skip: !profile,
    variables: {
      id: params.childId,
    },
  });
  const getPathname = useGetPathname();

  const [deleteChild] = useMutation<DeleteChildMutationPayloadFieldsFragment>(
    deleteChildMutation,
    {
      client: graphqlClient,
      refetchQueries: [{ query: ProfileQueryDocument }],
      onCompleted: () => {
        refetchProfile();
      },
    }
  );

  const [editChild] = useMutation<UpdateChildMutationPayloadFieldsFragment>(
    editChildMutation,
    {
      refetchQueries: [
        { query: childByIdQuery, variables: { id: params.childId } },
      ],
      onCompleted: () => {
        refetchProfile();
      },
    }
  );

  const [isOpen, setIsOpen] = React.useState(false);
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
            title={child.name || t('profile.child.default.name.text')}
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
                  iconStart={<IconPen />}
                >
                  {t('profile.children.edit.button.text')}
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
          <AdditionalNotesCard
            title={t('profile.childNotes.heading')}
            childId={child.id}
          />
        </>
      ) : (
        <div className={styles.noChild}>
          <p>{t('profile.children.noChild.text')}</p>
        </div>
      )}
    </ListPageLayout>
  );
};

export default ProfileChildDetail;
