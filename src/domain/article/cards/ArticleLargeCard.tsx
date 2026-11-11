import {
  type CollectionItemType,
  LargeCard,
  ModuleItemTypeEnum,
  useConfig,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import ArticleDetails from '../articleDetails/ArticleDetails';
import { getArticleCardData } from './articleCardUtils';

export const ArticleLargeCard = (item: CollectionItemType) => {
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
    <LargeCard
      key={`lg-card-${cardItem?.id}`}
      {...baseCardProps}
      imageUrl={imageUrl}
      subTitle={subTitle}
      url={url}
      hasLink={hasLink}
      customContent={<ArticleDetails keywords={keywords} />}
    />
  );
};

export default ArticleLargeCard;
