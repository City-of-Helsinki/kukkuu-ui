import { ReactNode } from 'react';
import classnames from 'classnames';

import PageMeta from './utilityComponents/PageMeta';
import Container from './Container';
import styles from './pageWrapper.module.scss';

export type PageWrapperProps = {
  className?: string;
  title?: string;
  containerClassName?: string;
  description?: string;
  children: ReactNode;
  // In some navigations during the login process the Helmet component raised errors,
  // so it should be possible to switch off the Helmet component.
  usePageMeta?: boolean;
};

const PageWrapper = ({
  children,
  className,
  containerClassName,
  title,
  description = 'homePage.hero.descriptionText',
  usePageMeta = true,
}: PageWrapperProps) => {
  return (
    <div className={classnames(styles.pageWrapper, className)}>
      {usePageMeta && <PageMeta title={title} description={description} />}
      <Container className={classnames(containerClassName)}>
        {children}
      </Container>
    </div>
  );
};

export default PageWrapper;
