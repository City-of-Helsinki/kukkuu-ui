import { describe, expect, it } from 'vitest';

import {
  cleanModuleId,
  findPackageRoot,
  isPackageRootLocation,
  normalizeSourceUrl,
  readDeclaredLicense,
  renderNotices,
  UNKNOWN_LICENSE,
  wrapText,
  type PackageLicense,
} from '../thirdPartyLicenses';

const PNPM_MODULE =
  '/app/node_modules/.pnpm/react@19.2.6/node_modules/react/index.js';
const PNPM_PACKAGE_ROOT =
  '/app/node_modules/.pnpm/react@19.2.6/node_modules/react';

/** Treats every directory as a package root, except the listed exceptions. */
const packageRootsExcept =
  (...notRoots: string[]) =>
  (dir: string) =>
    !notRoots.includes(dir);

const entry = (overrides: Partial<PackageLicense> = {}): PackageLicense => ({
  name: 'example',
  version: '1.0.0',
  license: 'MIT',
  declaredLicense: 'MIT',
  licenseText: 'MIT License, Copyright (c) Example',
  ...overrides,
});

describe('cleanModuleId', () => {
  it('strips query strings and virtual module prefixes', () => {
    expect(cleanModuleId(`${PNPM_MODULE}?commonjs-proxy`)).toBe(PNPM_MODULE);
    expect(cleanModuleId(`\0commonjs-proxy:${PNPM_MODULE}`)).toBe(PNPM_MODULE);
  });

  it('leaves Windows drive letters alone', () => {
    expect(cleanModuleId('C:/app/node_modules/react/index.js')).toBe(
      'C:/app/node_modules/react/index.js'
    );
  });
});

describe('findPackageRoot', () => {
  it('resolves a module in the pnpm store layout', () => {
    expect(findPackageRoot(PNPM_MODULE, packageRootsExcept())).toBe(
      PNPM_PACKAGE_ROOT
    );
  });

  it('resolves a module in a hoisted layout', () => {
    expect(
      findPackageRoot('/app/node_modules/lodash/lodash.js', packageRootsExcept())
    ).toBe('/app/node_modules/lodash');
  });

  it('resolves scoped packages to the scoped directory', () => {
    expect(
      findPackageRoot(
        '/app/node_modules/@apollo/client/core/index.js',
        packageRootsExcept('/app/node_modules/@apollo/client/core')
      )
    ).toBe('/app/node_modules/@apollo/client');
  });

  it('resolves to the innermost package when node_modules are nested', () => {
    expect(
      findPackageRoot(
        '/app/node_modules/outer/node_modules/inner/lib/index.js',
        packageRootsExcept('/app/node_modules/outer/node_modules/inner/lib')
      )
    ).toBe('/app/node_modules/outer/node_modules/inner');
  });

  it('skips the subpath manifests a package ships for its entry points', () => {
    // @apollo/client ships e.g. link/utils/package.json naming
    // "@apollo/client/link/utils" but no version. Only the root manifest of
    // the published package names one, so only it counts as a package root.
    expect(
      findPackageRoot(
        '/app/node_modules/@apollo/client/link/utils/index.js',
        (dir) => dir === '/app/node_modules/@apollo/client'
      )
    ).toBe('/app/node_modules/@apollo/client');
  });

  it('skips nested manifests that do not name a package', () => {
    // Packages such as date-fns ship a package.json in subdirectories that
    // only carries fields like "sideEffects".
    expect(
      findPackageRoot(
        '/app/node_modules/date-fns/esm/index.js',
        packageRootsExcept('/app/node_modules/date-fns/esm')
      )
    ).toBe('/app/node_modules/date-fns');
  });

  it('returns null for application sources and virtual modules', () => {
    expect(
      findPackageRoot('/app/src/domain/app/App.tsx', packageRootsExcept())
    ).toBeNull();
    expect(findPackageRoot('\0vite/modulepreload-polyfill', () => true)).toBe(
      null
    );
  });

  it('returns null when no ancestor is a package root', () => {
    expect(findPackageRoot(PNPM_MODULE, () => false)).toBeNull();
  });

  it('skips a subpath manifest that names both a subpath and a version', () => {
    // @hookform/resolvers/yup/package.json carries "name":
    // "@hookform/resolvers/yup" and "version": "1.0.0", so the manifest looks
    // exactly like a published package. Only its location gives it away.
    expect(
      findPackageRoot(
        '/app/node_modules/@hookform/resolvers/yup/dist/yup.mjs',
        packageRootsExcept()
      )
    ).toBe('/app/node_modules/@hookform/resolvers');
  });
});

describe('isPackageRootLocation', () => {
  it('accepts a package directly inside node_modules', () => {
    expect(isPackageRootLocation('/app/node_modules/lodash')).toBe(true);
  });

  it('accepts a scoped package', () => {
    expect(isPackageRootLocation('/app/node_modules/@apollo/client')).toBe(true);
  });

  it('rejects a subdirectory of a package', () => {
    expect(isPackageRootLocation('/app/node_modules/date-fns/esm')).toBe(false);
    expect(
      isPackageRootLocation('/app/node_modules/@hookform/resolvers/yup')
    ).toBe(false);
  });

  it('rejects a node_modules directory itself', () => {
    expect(isPackageRootLocation('/app/node_modules')).toBe(false);
  });
});

describe('readDeclaredLicense', () => {
  it('reads the modern string field', () => {
    expect(readDeclaredLicense({ license: 'Apache-2.0' })).toBe('Apache-2.0');
  });

  it('reads the legacy licenses array', () => {
    // The shape still used by e.g. format@0.2.2.
    expect(
      readDeclaredLicense({
        licenses: [{ type: 'MIT', url: 'http://sjs.mit-license.org' }],
      })
    ).toBe('MIT');
  });

  it('joins several legacy entries into an expression', () => {
    expect(
      readDeclaredLicense({ licenses: [{ type: 'MIT' }, { type: 'GPL-2.0' }] })
    ).toBe('(MIT OR GPL-2.0)');
  });

  it('reads the legacy license object', () => {
    expect(readDeclaredLicense({ license: { type: 'ISC' } })).toBe('ISC');
  });

  it('reports an unknown license when nothing is declared', () => {
    expect(readDeclaredLicense({})).toBe(UNKNOWN_LICENSE);
    expect(readDeclaredLicense({ license: '' })).toBe(UNKNOWN_LICENSE);
  });
});

describe('normalizeSourceUrl', () => {
  it('turns a git+https url into a browsable one', () => {
    expect(
      normalizeSourceUrl({
        type: 'git',
        url: 'git+https://github.com/jonkoops/matomo-tracker.git',
      })
    ).toBe('https://github.com/jonkoops/matomo-tracker');
  });

  it('turns a git protocol url into https', () => {
    expect(
      normalizeSourceUrl({ url: 'git://github.com/cure53/DOMPurify.git' })
    ).toBe('https://github.com/cure53/DOMPurify');
  });

  it('points at the subdirectory of a monorepo package', () => {
    expect(
      normalizeSourceUrl({
        url: 'git+https://github.com/jonkoops/matomo-tracker.git',
        directory: 'packages/react',
      })
    ).toBe(
      'https://github.com/jonkoops/matomo-tracker/tree/HEAD/packages/react'
    );
  });

  it('expands shorthand repository fields', () => {
    expect(normalizeSourceUrl('github:sindresorhus/type-fest')).toBe(
      'https://github.com/sindresorhus/type-fest'
    );
    expect(normalizeSourceUrl('isaacs/minimatch')).toBe(
      'https://github.com/isaacs/minimatch'
    );
  });

  it('falls back to the homepage and then to nothing', () => {
    expect(normalizeSourceUrl(undefined, 'https://example.test')).toBe(
      'https://example.test'
    );
    expect(normalizeSourceUrl(undefined, undefined)).toBeUndefined();
  });
});

describe('wrapText', () => {
  it('wraps at the given column without splitting words', () => {
    const wrapped = wrapText('aaa bbb ccc ddd', 7);
    expect(wrapped).toBe('aaa bbb\nccc ddd');
    wrapped.split('\n').forEach((line) => {
      expect(line.length).toBeLessThanOrEqual(7);
    });
  });
});

describe('renderNotices', () => {
  it('sorts entries and stays byte-identical between runs', () => {
    const entries = [
      entry({ name: 'zod' }),
      entry({ name: 'react', version: '19.2.6' }),
      entry({ name: 'react', version: '18.0.0' }),
    ];

    const output = renderNotices(entries);

    expect(output.indexOf('react@18.0.0')).toBeLessThan(
      output.indexOf('react@19.2.6')
    );
    expect(output.indexOf('react@19.2.6')).toBeLessThan(output.indexOf('zod@'));
    expect(renderNotices([...entries].reverse())).toBe(output);
  });

  it('states the application license and the component count', () => {
    const output = renderNotices([entry(), entry({ name: 'other' })]);

    expect(output).toContain('MIT License');
    expect(output).toContain('Copyright (c) 2024 City of Helsinki');
    expect(output).toContain('Components: 2');
  });

  it('includes the license text of a package verbatim', () => {
    const output = renderNotices([
      entry({ licenseText: 'Copyright (c) Someone\nPermission is granted.\n' }),
    ]);

    expect(output).toContain('Copyright (c) Someone\nPermission is granted.');
  });

  it('records that a package ships no license text', () => {
    const output = renderNotices([
      entry({ name: 'callsite', licenseText: undefined }),
    ]);

    expect(output).toContain('ships no license text of its own');
    expect(output).toContain('callsite declares in its package.json');
  });

  it('gives MPL-2.0 components a section 3.2 source notice', () => {
    const output = renderNotices([
      entry({
        name: '@jonkoops/matomo-tracker',
        version: '0.7.0',
        license: 'MPL-2.0',
        declaredLicense: 'MPL-2.0',
        sourceUrl:
          'https://github.com/jonkoops/matomo-tracker/tree/HEAD/packages/js',
      }),
    ]);

    expect(output).toContain('MPL-2.0 section 3.2 notice');
    expect(output).toContain(
      'https://github.com/jonkoops/matomo-tracker/tree/HEAD/packages/js'
    );
    expect(output).toContain('npm pack @jonkoops/matomo-tracker@0.7.0');
  });

  it('does not add an MPL notice to permissive components', () => {
    expect(renderNotices([entry()])).not.toContain('section 3.2');
  });

  it('records the elected license of a dual-licensed component', () => {
    const output = renderNotices([
      entry({
        name: 'dompurify',
        version: '3.4.13',
        license: 'Apache-2.0',
        declaredLicense: '(MPL-2.0 OR Apache-2.0)',
        licenseNote:
          'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
          'distribution elects Apache-2.0, so the MPL-2.0 obligations do ' +
          'not apply to this component.',
      }),
    ]);

    expect(output).toContain('License: Apache-2.0');
    expect(output).toContain('Declared as: (MPL-2.0 OR Apache-2.0)');
    expect(output).toContain('elects Apache-2.0');
    // The election is what removes the MPL obligation, so the notice for it
    // must not be emitted for this component.
    expect(output).not.toContain('MPL-2.0 section 3.2 notice');
  });

  it('records the corrected license of a component declaring a vague one', () => {
    const output = renderNotices([
      entry({
        name: 'css-mediaquery',
        version: '0.1.2',
        license: 'BSD-3-Clause',
        declaredLicense: 'BSD',
        licenseNote:
          'Declares the ambiguous, non-SPDX string "BSD" in its ' +
          'package.json. Its license file is the three-clause BSD license ' +
          'of Yahoo! Inc.',
      }),
    ]);

    expect(output).toContain('License: BSD-3-Clause');
    expect(output).toContain('Declared as: BSD');
    expect(output).toContain('three-clause BSD license');
  });

  it('reproduces the license text of the application when given one', () => {
    const output = renderNotices(
      [entry()],
      'MIT License\n\nCopyright (c) 2024 City of Helsinki\n\nPermission is hereby granted.\n'
    );

    expect(output).toContain('distributed under the following license');
    expect(output).toContain('Permission is hereby granted.');
    expect(output).toContain(
      'Source: https://github.com/City-of-Helsinki/kukkuu-ui'
    );
  });

  it('falls back to naming the application license when none is given', () => {
    const output = renderNotices([entry()]);

    expect(output).toContain(
      'The application itself is licensed under the MIT License.'
    );
    expect(output).toContain('Copyright (c) 2024 City of Helsinki');
    expect(output).not.toContain('distributed under the following license');
  });
});
