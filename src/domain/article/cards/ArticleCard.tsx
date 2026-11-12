import {
  Card,
  type CollectionItemType,
  ModuleItemTypeEnum,
  useConfig,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import ArticleDetails from '../articleDetails/ArticleDetails';
import { getArticleCardData } from './articleCardUtils';

/**
 * Standard article card component rendered in article listings and archives.
 *
 * @param item - The collection item representing a CMS article.
 * @returns Card component with article image, title, publish date, and category tags.
 */
export const ArticleCard = (item: CollectionItemType) => {
  const {
    utils: { getRoutedInternalHref },
  } = useConfig();
  const {
    cardItem,
    baseCardProps,
    keywords,
    url,
    imageUrl,
    subTitle,
    hasLink,
  } = getArticleCardData(item, (link) =>
    getRoutedInternalHref(link, ModuleItemTypeEnum.Article)
  );

  return (
    <Card
      key={`sm-card-${cardItem?.id}`}
      {...baseCardProps}
      text=""
      imageUrl={imageUrl}
      subTitle={subTitle}
      url={url}
      hasLink={hasLink}
      customContent={<ArticleDetails keywords={keywords} />}
    />
  );
};

export default ArticleCard;
