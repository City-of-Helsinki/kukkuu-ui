import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { customRender as render } from '../../../../common/test/customRender';
import {
  fakeArticle,
  fakeCategory,
  fakeMediaItem,
} from '../../../../utils/cmsMockDataUtils';
import ArticleCard from '../ArticleCard';
import ArticleLargeCard from '../ArticleLargeCard';
import { formatDate, getArticleCardData } from '../articleCardUtils';

describe('articleCardUtils', () => {
  describe('formatDate', () => {
    it('formats ISO date strings correctly to d.M.yyyy', () => {
      expect(formatDate('2026-05-01T10:00:00')).toBe('1.5.2026');
      expect(formatDate('2026-12-24T00:00:00')).toBe('24.12.2026');
    });

    it('returns empty string for null, undefined, or empty string', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('returns empty string for invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('getArticleCardData', () => {
    it('correctly maps ArticleType fields into card properties', () => {
      const mockArticle = fakeArticle({
        id: 'post-1',
        title: 'Uutinen',
        date: '2026-06-15T12:00:00',
        uri: '/fi/uutinen/',
        featuredImage: {
          node: fakeMediaItem({
            medium: 'https://example.com/medium.jpg',
            mediaItemUrl: 'https://example.com/original.jpg',
          }),
          __typename: 'NodeWithFeaturedImageToMediaItemConnectionEdge',
        },
        categories: {
          __typename: 'PostToCategoryConnection',
          edges: [
            {
              __typename: 'PostToCategoryConnectionEdge',
              node: fakeCategory({ name: 'Lapset' }),
            },
            {
              __typename: 'PostToCategoryConnectionEdge',
              node: fakeCategory({ name: 'Kulttuuri' }),
            },
            {
              __typename: 'PostToCategoryConnectionEdge',
              node: fakeCategory({ name: null }),
            },
          ],
        },
      });

      const mockGetRoutedInternalHref = (link?: string | null) =>
        `/fi/articles/${link?.replace(/^\/|\/$/g, '')}`;

      const data = getArticleCardData(mockArticle, mockGetRoutedInternalHref);

      expect(data.cardItem).toBe(mockArticle);
      expect(data.keywords).toEqual(['Lapset', 'Kulttuuri']);
      expect(data.subTitle).toBe('15.6.2026');
      expect(data.imageUrl).toBe('https://example.com/medium.jpg');
      expect(data.url).toBe('/fi/articles/fi/uutinen');
      expect(data.hasLink).toBe(true);
    });

    it('handles fallback image and missing link', () => {
      const mockArticle = fakeArticle({
        id: 'post-2',
        title: 'Ei kuvaa',
        uri: null,
        link: null,
        featuredImage: null,
        date: null,
      });

      const mockGetRoutedInternalHref = () => '#';

      const data = getArticleCardData(mockArticle, mockGetRoutedInternalHref);

      expect(data.keywords).toEqual([]);
      expect(data.subTitle).toBe('');
      expect(data.url).toBe('#');
      expect(data.hasLink).toBe(false);
    });

    it('falls back to uri when link is an empty string', () => {
      const mockArticle = fakeArticle({
        id: 'post-empty-link',
        title: 'Tyhjä linkki',
        link: '',
        uri: '/fi/artikkelit/tyhja-linkki/',
      });

      const mockGetRoutedInternalHref = (link?: string | null) =>
        `/fi/articles/${link?.replace(/^\/|\/$/g, '')}`;

      const data = getArticleCardData(mockArticle, mockGetRoutedInternalHref);

      expect(data.url).toBe('/fi/articles/fi/artikkelit/tyhja-linkki');
      expect(data.hasLink).toBe(true);
    });
  });

  describe('card components with empty link and valid URI', () => {
    const articleWithEmptyLink = fakeArticle({
      id: 'post-card-test',
      title: 'Korttiartikkeli',
      link: '',
      uri: '/fi/uutiset/korttiartikkeli/',
    });

    it('ArticleCard renders link using uri when link is empty', () => {
      render(<ArticleCard {...articleWithEmptyLink} />);
      const links = screen.getAllByRole('link', { name: /Korttiartikkeli/i });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute(
          'href',
          '/fi/articles/uutiset/korttiartikkeli'
        );
      });
    });

    it('ArticleLargeCard renders link using uri when link is empty', () => {
      render(<ArticleLargeCard {...articleWithEmptyLink} />);
      const links = screen.getAllByRole('link', { name: /Korttiartikkeli/i });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute(
          'href',
          '/fi/articles/uutiset/korttiartikkeli'
        );
      });
    });
  });
});
