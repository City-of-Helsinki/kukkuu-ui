import React from 'react';
import {
  ContentContainer,
  PageMainContent,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import {
  SkeletonLine,
  SkeletonLoader,
} from '../../../common/components/skeleton/CmsSkeleton';
import styles from './homeCmsContent.module.scss';

export type HomeCmsContentProps = {
  content?: string | null;
  isLoading?: boolean;
  className?: string;
};

const HomeCmsContentSkeleton: React.FC = () => (
  <div data-testid="home-cms-content-skeleton">
    <SkeletonLine
      width="40%"
      height="2rem"
      style={{ marginBottom: 'var(--spacing-l, 24px)' }}
    />
    <div>
      <SkeletonLine
        width="100%"
        height="1.25rem"
        style={{ marginBottom: 'var(--spacing-xs, 8px)' }}
      />
      <SkeletonLine
        width="95%"
        height="1.25rem"
        style={{ marginBottom: 'var(--spacing-xs, 8px)' }}
      />
      <SkeletonLine
        width="98%"
        height="1.25rem"
        style={{ marginBottom: 'var(--spacing-xs, 8px)' }}
      />
      <SkeletonLine
        width="65%"
        height="1.25rem"
        style={{ marginBottom: 'var(--spacing-l, 24px)' }}
      />
    </div>
  </div>
);

const HomeCmsContent: React.FC<HomeCmsContentProps> = ({
  content,
  isLoading = false,
  className,
}) => {
  const hasContent = Boolean(content && content.trim());

  if (!isLoading && !hasContent) {
    return null;
  }

  return (
    <section
      className={className || styles.cmsSection}
      aria-busy={isLoading ? 'true' : undefined}
      data-testid="home-cms-content"
    >
      <ContentContainer className={styles.container}>
        <SkeletonLoader
          isLoading={isLoading}
          skeleton={<HomeCmsContentSkeleton />}
          as={null}
        >
          {() => <PageMainContent title="" content={content ?? ''} />}
        </SkeletonLoader>
      </ContentContainer>
    </section>
  );
};

export default HomeCmsContent;
