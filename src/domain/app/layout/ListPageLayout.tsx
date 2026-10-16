import { ReactNode } from 'react';
import { Breadcrumb, Container, IconArrowLeft, IconSize } from 'hds-react';
import type { BreadcrumbListItem } from 'hds-react';
import { Link, LinkProps } from 'react-router';
import { useTranslation } from 'react-i18next';

import Text from '../../../common/components/text/Text';
import PageMeta from './utilityComponents/PageMeta';
import styles from './listPageLayout.module.scss';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbListItem[];
};

function ListPageLayout({
  children,
  title,
  description,
  breadcrumbs,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta title={title} description={description} />
      {breadcrumbs && (
        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumb
            aria-label={t('common.breadcrumbNavigationLabel')}
            list={breadcrumbs}
            className={styles.breadcrumbs}
          />
        </div>
      )}
      <div className={styles.wrapper}>
        <Container role="main" className={styles.container}>
          {children}
        </Container>
      </div>
    </>
  );
}

type ListPageLayoutHeaderProps = {
  title: string;
  content?: ReactNode;
  actions?: ReactNode;
  backButtonHref?: LinkProps['to'];
};

function ListPageLayoutHeader({
  title,
  content,
  actions,
  backButtonHref,
}: ListPageLayoutHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.header}>
        {backButtonHref && (
          <div className={styles.headerBackButtonContainer}>
            <Link
              aria-label={t('common.backButton.label')}
              className={styles.headerBackButton}
              to={backButtonHref}
            >
              <IconArrowLeft size={IconSize.Small} />
            </Link>
          </div>
        )}
        <Text variant="h1" className={styles.headerTitle}>
          {title}
        </Text>
        {content && <div className={styles.headerContent}>{content}</div>}
        {actions && <div className={styles.headerActions}>{actions}</div>}
      </div>
    </>
  );
}

ListPageLayout.Header = ListPageLayoutHeader;

export default ListPageLayout;
