import { ReactNode } from 'react';
import classnames from 'classnames';

import PageMeta from './utilityComponents/PageMeta';
import Container from './Container';
import styles from './pageWrapper.module.scss';

type Props = {
  className?: string;
  title?: string;
  containerClassName?: string;
  description?: string;
  children: ReactNode;
};

const PageWrapper = ({
  children,
  className,
  containerClassName,
  title,
  description = 'homePage.hero.descriptionText',
}: Props) => {
  return (
    <div className={classnames(styles.pageWrapper, className)}>
      <PageMeta title={title} description={description} />
      <Container className={classnames(containerClassName)}>
        {children}
      </Container>
    </div>
  );
};

export default PageWrapper;
