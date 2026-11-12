import { TagComponent as Tag } from '@city-of-helsinki/react-helsinki-headless-cms';
import React from 'react';

import styles from './articleDetails.module.scss';

export type ArticleDetailsProps = {
  keywords?: string[];
};

/**
 * Renders keyword tag pills for article cards.
 *
 * Displays up to two keyword tags and shows a count badge (+N) for remaining tags.
 */
const ArticleDetails: React.FC<ArticleDetailsProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  const [first, second, ...restKeywords] = keywords;

  return (
    <div className={styles.tags}>
      {[first, second].filter(Boolean).map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
      {!!restKeywords.length && (
        <Tag className={styles.tagCount}>{`+${restKeywords.length}`}</Tag>
      )}
    </div>
  );
};

export default ArticleDetails;
