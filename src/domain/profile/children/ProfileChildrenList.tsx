import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Card, IconPlus } from 'hds-react';

import {
  ProfileQueryDocument,
  UpdateChildMutationInput,
} from '../../api/generatedTypes/graphql';
import Button from '../../../common/components/button/Button';
import AddNewChildFormModal from '../../registration/modal/AddNewChildFormModal';
import { addChildMutation } from '../../child/mutation/ChildMutation';
import { getSupportedChildData } from '../../child/ChildUtils';
import { Child } from '../../child/types/ChildInputTypes';
import { MyProfileChild } from '../types/ProfileQueryTypes';
import ProfileChildAccordionItem from './child/ProfileChildAccordionItem';
import ProfileChildSkeleton from './skeleton/ProfileChildSkeleton';
import { useProfileContext } from '../hooks/useProfileContext';
import graphqlClient from '../../api/client';
import styles from './profileChildrenList.module.scss';

/**
 * Props for {@link ProfileChildrenEmptyState}.
 */
export type ProfileChildrenEmptyStateProps = {
  onAddChild: () => void;
};

/**
 * Empty state card shown when a guardian has no registered children yet.
 */
export const ProfileChildrenEmptyState: React.FC<
  ProfileChildrenEmptyStateProps
> = ({ onAddChild }) => {
  const { t } = useTranslation();

  return (
    <Card border className={styles.emptyStateCard}>
      <h3 className={styles.emptyTitle}>
        {t('profile.children.emptyState.title')}
      </h3>
      <p className={styles.emptyText}>
        {t('profile.children.emptyState.text')}
      </p>
      <Button
        variant="secondary"
        theme="black"
        iconStart={<IconPlus aria-hidden="true" />}
        className={styles.emptyButton}
        onClick={onAddChild}
        aria-haspopup="dialog"
        aria-label={t('profile.children.addChild.buttonAriaLabel')}
      >
        {t('profile.children.addChild.buttonText')}
      </Button>
    </Card>
  );
};

/**
 * Props for {@link ProfileChildrenAccordionList}.
 */
export type ProfileChildrenAccordionListProps = {
  childrenList: MyProfileChild[];
  selectedChildId?: string | null;
  hasMatchingChild?: boolean;
};

/**
 * Accordion list rendering each registered child as a collapsable accordion item.
 */
export const ProfileChildrenAccordionList: React.FC<
  ProfileChildrenAccordionListProps
> = ({ childrenList, selectedChildId, hasMatchingChild }) => {
  return (
    <ul
      className={styles.childrenAccordionList}
      aria-labelledby="children-section-heading"
    >
      {childrenList.map((child, index) => (
        <li key={child.id} className={styles.childListItem}>
          <ProfileChildAccordionItem
            child={child}
            initiallyOpen={
              hasMatchingChild ? child.id === selectedChildId : index === 0
            }
          />
        </li>
      ))}
    </ul>
  );
};

/**
 * Displays guardian's children list in accordions with actions to add a child.
 * Composed of skeleton, empty state, and child accordion list subcomponents.
 */
export const ProfileChildrenList: React.FC = () => {
  const { t } = useTranslation();
  const { profile, refetchProfile, isLoading: isProfileLoading } =
    useProfileContext();
  const childrenEdges = profile?.children?.edges;
  const childrenList = childrenEdges
    ?.map((edge) => edge?.node)
    ?.filter((node): node is NonNullable<typeof node> => Boolean(node));
  const [searchParams] = useSearchParams();
  const selectedChildId = searchParams.get('child');
  const hasMatchingChild = Boolean(
    selectedChildId &&
      childrenList?.some((child) => child.id === selectedChildId)
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addChild, { loading: mutationLoading }] = useMutation(
    addChildMutation,
    {
      client: graphqlClient,
      refetchQueries: [{ query: ProfileQueryDocument }],
      onCompleted: () => {
        refetchProfile();
      },
    }
  );
  const { trackEvent } = useMatomo();

  const handleAddChild = (payload: Child) => {
    const supportedChildData: Omit<UpdateChildMutationInput, 'id'> =
      getSupportedChildData(payload);
    addChild({ variables: { input: supportedChildData } })
      .then(() => {
        trackEvent({ category: 'action', action: 'Add child' });
      })
      .catch((error) => {
        toast.error(t('profile.addChildMutation.errorMessage'));
        Sentry.captureException(error);
      });
  };

  const renderChildrenContent = () => {
    if (mutationLoading || isProfileLoading) {
      return <ProfileChildSkeleton />;
    }

    if (!childrenList || childrenList.length === 0) {
      return (
        <ProfileChildrenEmptyState onAddChild={() => setIsAddModalOpen(true)} />
      );
    }

    return (
      <ProfileChildrenAccordionList
        childrenList={childrenList}
        selectedChildId={selectedChildId}
        hasMatchingChild={hasMatchingChild}
      />
    );
  };

  return (
    <section
      className={styles.layout}
      aria-labelledby="children-section-heading"
    >
      <div className={styles.headerRow}>
        <h2 id="children-section-heading" className={styles.heading}>
          {t('profile.children.heading')}
        </h2>
        <Button
          variant="secondary"
          theme="black"
          iconStart={<IconPlus aria-hidden="true" />}
          onClick={() => setIsAddModalOpen(true)}
          aria-haspopup="dialog"
          aria-label={t('profile.children.addChild.buttonAriaLabel')}
        >
          {t('profile.children.addChild.buttonText')}
        </Button>
      </div>

      {isAddModalOpen && (
        <AddNewChildFormModal
          setIsOpen={setIsAddModalOpen}
          addChild={handleAddChild}
        />
      )}

      {renderChildrenContent()}
    </section>
  );
};

export default ProfileChildrenList;
