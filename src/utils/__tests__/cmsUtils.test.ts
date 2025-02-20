import { removeSurroundingSlashes } from '../cmsUtils';

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
