import {
  type ArticleType,
  type CollectionItemType,
  getArticlePageCardProps,
  type ModuleItemTypeEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { format } from 'date-fns';

export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return format(d, 'd.M.yyyy');
  } catch {
    return '';
  }
};

export const getArticleCardData = (
  item: CollectionItemType,
  getRoutedInternalHref: (
    link?: string | null,
    type?: ModuleItemTypeEnum
  ) => string
) => {
  const cardItem = item as ArticleType;
  const baseCardProps = getArticlePageCardProps(cardItem);
  const keywords =
    cardItem?.categories?.edges
      ?.map((edge) => edge?.node?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  const url = getRoutedInternalHref(
    cardItem?.link || cardItem?.uri
  );

  return {
    cardItem,
    baseCardProps,
    keywords,
    url,
    imageUrl:
      cardItem?.featuredImage?.node?.medium ||
      cardItem?.featuredImage?.node?.mediaItemUrl ||
      baseCardProps.imageUrl,
    subTitle: formatDate(cardItem?.date),
    hasLink: Boolean(url && url !== '#'),
  };
};
