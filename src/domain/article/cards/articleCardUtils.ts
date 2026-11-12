import {
  type ArticleType,
  type CollectionItemType,
  getArticlePageCardProps,
  type ModuleItemTypeEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { format } from 'date-fns';

/**
 * Formats an ISO date string into standard Finnish date format (d.M.yyyy).
 *
 * @param dateStr - The raw date string.
 * @returns Formatted date string, or an empty string if null/invalid.
 */
export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return format(d, 'd.M.yyyy');
  } catch {
    return '';
  }
};

/**
 * Extracts and formats presentation properties for an article card component.
 *
 * Resolves card props, categories/keywords, internal link URL, fallback image,
 * and localized publish date subtitle.
 *
 * @param item - The CMS collection item.
 * @param getRoutedInternalHref - Route resolver function for internal links.
 * @returns Structured card data for rendering.
 */
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
