import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { IconCogwheel } from 'hds-react';

import PageWrapper from '../../../app/layout/PageWrapper';
import backIcon from '../../../../assets/icons/svg/arrowLeft.svg';
import personIcon from '../../../../assets/icons/svg/person.svg';
import childIcon from '../../../../assets/icons/svg/childFaceHappy.svg';
import birthdateIcon from '../../../../assets/icons/svg/birthdayCake.svg';
import Icon from '../../../../common/components/icon/Icon';
import GiveFeedbackButton from '../../../../common/components/giveFeedbackButton/GiveFeedbackButton';
import { formatTime, newMoment } from '../../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';
import ErrorMessage from '../../../../common/components/error/Error';
import Button from '../../../../common/components/button/Button';
import { deleteChild_deleteChild as DeleteChildPayload } from '../../../api/generatedTypes/deleteChild';
import { UpdateChildMutationInput as EditChildInput } from '../../../api/generatedTypes/globalTypes';
import { updateChild_updateChild as EditChildPayload } from '../../../api/generatedTypes/updateChild';
import { childByIdQuery as ChildByIdResponse } from '../../../api/generatedTypes/childByIdQuery';
import { childByIdQuery } from '../../../child/queries/ChildQueries';
import LoadingSpinner from '../../../../common/components/spinner/LoadingSpinner';
import {
  deleteChildMutation,
  editChildMutation,
} from '../../../child/mutation/ChildMutation';
import useProfile from '../../hooks/useProfile';
import ProfileEvents from '../../events/ProfileEvents';
import profileQuery from '../../queries/ProfileQuery';
import ProfileChildDetailEditModal from './modal/ProfileChildDetailEditModal';
import styles from './profileChildDetail.module.scss';
import { useProfileRouteGoBack } from '../../route/ProfileRoute';

export type ChildDetailEditModalPayload = Omit<EditChildInput, 'id'>;

const ProfileChildDetail = () => {
  const { t } = useTranslation();
  const params = useParams<{ childId: string }>();
  const { data: guardian } = useProfile();
  const history = useHistory();
  const goBack = useProfileRouteGoBack();
  const { loading, error, data } = useQuery<ChildByIdResponse>(childByIdQuery, {
    variables: {
      id: params.childId,
    },
  });

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
    <PageWrapper className={styles.wrapper}>
      <div className={styles.childDetailWrapper} role="main">
        <div className={styles.backButtonWrapper}>
          <Button
            variant="secondary"
            aria-label={t('common.backButton.label')}
            onClick={goBack}
          >
            <Icon src={backIcon} className={styles.backButtonIcon} />
          </Button>
        </div>
        <div className={styles.childWrapper}>
          {child ? (
            <div className={styles.childInfo}>
              <div className={styles.childInfoHeadingRow}>
                <div className={styles.childName}>
                  <Icon
                    src={childIcon}
                    className={styles.childIcon}
                    alt={t('profile.child.default.name.text')}
                  />
                  <h1>
                    {child.firstName
                      ? `${child.firstName} ${child.lastName}`
                      : t('profile.child.default.name.text')}
                  </h1>
                </div>

                <Button
                  variant="supplementary"
                  className={styles.editChildInfoButton}
                  onClick={() => setIsOpen(true)}
                  iconRight={<IconCogwheel />}
                >
                  {t('profile.edit.button.text')}
                </Button>
              </div>
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
                      toast.error(
                        t('registration.submitMutation.errorMessage')
                      );
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
                        history.push('/profile');
                      }
                    } catch (error) {
                      toast.error(
                        t('registration.submitMutation.errorMessage')
                      );
                      Sentry.captureException(error);
                    }
                  }}
                />
              )}
              <div className={styles.childInfoRow}>
                <Icon
                  src={birthdateIcon}
                  alt={t('profile.child.detail.birthdate')}
                />
                <span>
                  {formatTime(newMoment(child.birthdate), DEFAULT_DATE_FORMAT)}
                </span>
              </div>
              <div className={styles.childInfoRow}>
                <Icon
                  src={personIcon}
                  alt={t('profile.child.detail.guardiansName')}
                />
                <span>{`${guardian?.firstName} ${guardian?.lastName}`}</span>
              </div>

              <div className={styles.eventWrapper}>
                <ProfileEvents child={child} />
              </div>
            </div>
          ) : (
            <div className={styles.noChild}>
              <p>{t('profile.children.noChild.text')}</p>
            </div>
          )}
          <GiveFeedbackButton />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfileChildDetail;
