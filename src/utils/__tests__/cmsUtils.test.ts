import {
  getArticleUriFromPathname,
  hasCmsCollections,
  removeSurroundingSlashes,
} from '../cmsUtils';

describe('hasCmsCollections', () => {
  it('returns false for null, undefined, or empty modules', () => {
    expect(hasCmsCollections(null)).toBe(false);
    expect(hasCmsCollections(undefined)).toBe(false);
    expect(hasCmsCollections({ modules: [] } as any)).toBe(false);
    expect(
      hasCmsCollections({
        modules: [{ __typename: 'LayoutContent' }],
      } as any)
    ).toBe(false);
  });

  it('returns true when page contains recognized collection modules', () => {
    expect(
      hasCmsCollections({
        modules: [{ __typename: 'LayoutCollection' }],
      } as any)
    ).toBe(true);

    expect(
      hasCmsCollections({
        modules: [{ __typename: 'EventSearch' }],
      } as any)
    ).toBe(true);

    expect(
      hasCmsCollections({
        modules: [{ __typename: 'LocationsSelectedCarousel' }],
      } as any)
    ).toBe(true);
  });
});

it.each([
  { input: 'test', expectedResult: 'test' },
  { input: '/test', expectedResult: 'test' },
  { input: 'test/', expectedResult: 'test' },
  { input: '/test/', expectedResult: 'test' },
  { input: '// test //', expectedResult: '/ test /' },
  { input: 'https://a.org/a/b/c/', expectedResult: 'https://a.org/a/b/c' },
  { input: 'https://a.org/a/b/c//', expectedResult: 'https://a.org/a/b/c/' },
  { input: 'https://a.org/a/b/c', expectedResult: 'https://a.org/a/b/c' },
  { input: '//\t\n/test/a-2/\n\t///', expectedResult: '/\t\n/test/a-2/\n\t//' },
  { input: ' /test/', expectedResult: ' /test' },
  { input: '\\test/\\', expectedResult: '\\test/\\' },
  { input: '1test-', expectedResult: '1test-' },
  { input: '/test/ ', expectedResult: 'test/ ' },
  { input: ' /test/ ', expectedResult: ' /test/ ' },
])(
  'removeSurroundingSlashes($input) returns $expectedResult',
  ({ input, expectedResult }) => {
    expect(removeSurroundingSlashes(input)).toStrictEqual(expectedResult);
  }
);

describe('getArticleUriFromPathname', () => {
  it('extracts localized article URI for standard article paths', () => {
    expect(getArticleUriFromPathname('/fi/articles/ensimmainen-artikkeli')).toBe(
      '/fi/ensimmainen-artikkeli'
    );
    expect(getArticleUriFromPathname('/sv/articles/forsta-artikeln/')).toBe(
      '/sv/forsta-artikeln'
    );
    expect(getArticleUriFromPathname('/en/articles/first-article')).toBe(
      '/en/first-article'
    );
  });

  it('handles paths without locale prefix', () => {
    expect(getArticleUriFromPathname('/articles/ensimmainen-artikkeli')).toBe(
      '/ensimmainen-artikkeli'
    );
  });

  it('returns empty string for archive path or non-article paths', () => {
    expect(getArticleUriFromPathname('/fi/articles')).toBe('');
    expect(getArticleUriFromPathname('/fi/articles/')).toBe('');
    expect(getArticleUriFromPathname('/fi/articles-info')).toBe('');
    expect(getArticleUriFromPathname('/fi/pages/tietoa-meista')).toBe('');
    expect(getArticleUriFromPathname('/fi/events')).toBe('');
    expect(getArticleUriFromPathname('')).toBe('');
  });
});
