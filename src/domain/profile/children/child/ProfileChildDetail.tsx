import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import styles from './profileChildDetail.module.scss';
import PageWrapper from '../../../app/layout/PageWrapper';
import backIcon from '../../../../assets/icons/svg/arrowLeft.svg';
import personIcon from '../../../../assets/icons/svg/person.svg';
import childIcon from '../../../../assets/icons/svg/childFaceHappy.svg';
import birthdateIcon from '../../../../assets/icons/svg/birthdayCake.svg';
import settingIcon from '../../../../assets/icons/svg/gear.svg';
import Icon from '../../../../common/components/icon/Icon';
import { formatTime, newMoment } from '../../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';
import { profileSelector } from '../../state/ProfileSelectors';
import ProfileEvents from '../../events/ProfileEvents';
import Button from '../../../../common/components/button/Button';
import ProfileChildDetailEditModal from './modal/ProfileChildDetailEditModal';
import { deleteChild_deleteChild as DeleteChildPayload } from '../../../api/generatedTypes/deleteChild';
import { UpdateChildMutationInput as EditChildInput } from '../../../api/generatedTypes/globalTypes';
import { updateChild_updateChild as EditChildPayload } from '../../../api/generatedTypes/updateChild';
import {
  deleteChildMutation,
  editChildMutation,
} from '../../../child/mutation/ChildMutation';
import profileQuery from '../../queries/ProfileQuery';
import { childByIdQuery } from '../../../child/queries/ChildQueries';
import LoadingSpinner from '../../../../common/components/spinner/LoadingSpinner';
import { childByIdQuery as ChildByIdResponse } from '../../../api/generatedTypes/childByIdQuery';
export type ChildDetailEditModalPayload = Omit<EditChildInput, 'id'>;

const ProfileChildDetail: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const params = useParams<{ childId: string }>();
  const guardian = useSelector(profileSelector);
  const history = useHistory();
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

  const [isOpen, setIsOpen] = React.useState(false);
  if (loading) {
    return <LoadingSpinner isLoading={true} />;
  }

  if (error) {
    Sentry.captureException(error);
    return (
      <PageWrapper>
        <div className={styles.profile}>{t('api.errorMessage')}</div>
      </PageWrapper>
    );
  }

  const child = data?.child;

  return (
    <PageWrapper
      className={styles.wrapper}
      title={t('profile.child.detail.page.title')}
    >
      <div className={styles.childDetailWrapper} role="main">
        <Button
          aria-label={t('common.backButton.label')}
          className={styles.backButton}
          onClick={() => history.goBack()}
        >
          <Icon
            src={backIcon}
            className={styles.backButtonIcon}
            alt={t('common.backButton.label')}
          />
        </Button>
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
                  ariaLabel={t('profile.edit.button.text')}
                  className={styles.editChildInfo}
                  onClick={() => setIsOpen(true)}
                >
                  <span>{t('profile.edit.button.text')}</span>
                  <Icon
                    src={settingIcon}
                    className={styles.settingIcon}
                    alt={t('profile.edit.button.text')}
                  />
                </Button>
              </div>
              {isOpen && (
                <ProfileChildDetailEditModal
                  isOpen={isOpen}
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
                      toast(t('registration.submitMutation.errorMessage'), {
                        type: toast.TYPE.ERROR,
                      });
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
                      toast(t('registration.submitMutation.errorMessage'), {
                        type: toast.TYPE.ERROR,
                      });
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
                <Icon src={personIcon} />
                <span>{`${guardian.firstName} ${guardian.lastName}`}</span>
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
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfileChildDetail;
