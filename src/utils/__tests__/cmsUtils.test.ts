import {
  getArticleUriFromPathname,
  hasCmsCollections,
  isCmsArticlePath,
  isCmsPagePath,
  removeSurroundingSlashes,
  withCmsPagesContextPath,
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

describe('isCmsPagePath', () => {
  it('returns true when pathname points to a dynamic CMS page under /pages', () => {
    expect(isCmsPagePath('/fi/pages/tietoa-meista')).toBe(true);
    expect(isCmsPagePath('/sv/pages/om-oss')).toBe(true);
    expect(isCmsPagePath('/pages/about')).toBe(true);
    expect(isCmsPagePath('/fi/pages/sub/nested')).toBe(true);
  });

  it('returns false for non-page routes or root pages path', () => {
    expect(isCmsPagePath('/fi/pages')).toBe(false);
    expect(isCmsPagePath('/fi/pages/')).toBe(false);
    expect(isCmsPagePath('/fi/events')).toBe(false);
    expect(isCmsPagePath('/fi/articles/ensimmainen-artikkeli')).toBe(false);
    expect(isCmsPagePath('/fi/profile')).toBe(false);
    expect(isCmsPagePath('/fi/ajankohtaista')).toBe(false);
    expect(isCmsPagePath('')).toBe(false);
  });
});

describe('isCmsArticlePath', () => {
  it('returns true when pathname points to an individual CMS article', () => {
    expect(isCmsArticlePath('/fi/articles/ensimmainen-artikkeli')).toBe(true);
    expect(isCmsArticlePath('/sv/articles/forsta-artikeln/')).toBe(true);
    expect(isCmsArticlePath('/articles/first-article')).toBe(true);
  });

  it('returns false for article archive or non-article routes', () => {
    expect(isCmsArticlePath('/fi/articles')).toBe(false);
    expect(isCmsArticlePath('/fi/articles/')).toBe(false);
    expect(isCmsArticlePath('/fi/articles-info')).toBe(false);
    expect(isCmsArticlePath('/fi/pages/tietoa-meista')).toBe(false);
    expect(isCmsArticlePath('/fi/events')).toBe(false);
    expect(isCmsArticlePath('')).toBe(false);
  });
});

describe('withCmsPagesContextPath', () => {
  it('returns uri unchanged for root or empty path', () => {
    expect(withCmsPagesContextPath('/')).toBe('/');
    expect(withCmsPagesContextPath('')).toBe('');
    expect(withCmsPagesContextPath('/fi')).toBe('/fi');
    expect(withCmsPagesContextPath('/fi/')).toBe('/fi/');
  });

  it('returns uri unchanged when already prefixed with context path', () => {
    expect(withCmsPagesContextPath('/fi/pages/tietoa-meista')).toBe(
      '/fi/pages/tietoa-meista'
    );
    expect(withCmsPagesContextPath('/pages/about')).toBe('/pages/about');
    expect(withCmsPagesContextPath('/fi/pages')).toBe('/fi/pages');
  });

  it('prefixes legacy slugs that merely share the prefix with context path', () => {
    expect(withCmsPagesContextPath('/fi/pages-info')).toBe(
      '/fi/pages/pages-info'
    );
    expect(withCmsPagesContextPath('/pages-faq')).toBe('/pages/pages-faq');
  });

  it('prefixes standard unprefixed CMS slugs', () => {
    expect(withCmsPagesContextPath('/fi/tietoa-meista')).toBe(
      '/fi/pages/tietoa-meista'
    );
    expect(withCmsPagesContextPath('/sv/om-oss')).toBe('/sv/pages/om-oss');
    expect(withCmsPagesContextPath('/about')).toBe('/pages/about');
  });
});
