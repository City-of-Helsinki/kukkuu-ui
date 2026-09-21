import type { LicenseMeta } from 'rollup-license-plugin';
import { describe, expect, it } from 'vitest';

import {
  formatAuthor,
  reconstructLicenseText,
  renderManifest,
  renderNotices,
  resolvePackage,
  wrapText,
  type ThirdPartyLicensesConfig,
} from '../thirdPartyLicenses';
import { thirdPartyLicensesConfig } from '../thirdPartyLicenses.config';

const config = (
  overrides: Partial<ThirdPartyLicensesConfig> = {}
): ThirdPartyLicensesConfig => ({
  repositoryUrl: 'https://github.com/example/app',
  ...overrides,
});

const pkg = (overrides: Partial<LicenseMeta> = {}): LicenseMeta =>
  ({
    name: 'example',
    version: '1.0.0',
    license: 'MIT',
    licenseText: 'MIT License, Copyright (c) Example',
    repository: 'https://github.com/example/example',
    source: 'https://registry.npmjs.org/example/-/example-1.0.0.tgz',
    ...overrides,
  }) as LicenseMeta;

const resolve = (
  overrides: Partial<LicenseMeta> = {},
  configOverrides: Partial<ThirdPartyLicensesConfig> = {}
) => resolvePackage(pkg(overrides), config(configOverrides));

const dompurifyDecision = {
  licenseDecisions: {
    dompurify: {
      license: 'Apache-2.0',
      note: 'This distribution elects Apache-2.0.',
    },
  },
};

describe('formatAuthor', () => {
  it('reads the string and object forms', () => {
    expect(formatAuthor('Jane Doe <jane@example.test>')).toBe(
      'Jane Doe <jane@example.test>'
    );
    expect(formatAuthor({ name: 'Jane Doe', email: 'jane@example.test' })).toBe(
      'Jane Doe <jane@example.test>'
    );
    expect(formatAuthor({ name: 'Jane Doe' })).toBe('Jane Doe');
  });

  it('reports nothing when no author is named', () => {
    expect(formatAuthor(undefined)).toBeUndefined();
    expect(formatAuthor('')).toBeUndefined();
  });
});

describe('reconstructLicenseText', () => {
  it('puts the author into the copyright line of the canonical text', () => {
    const text = reconstructLicenseText('MIT', 'Jane Doe <jane@example.test>');

    expect(text).toContain('Copyright (c) Jane Doe <jane@example.test>');
    expect(text).toContain('Permission is hereby granted, free of charge');
    expect(text).not.toContain('{{copyright}}');
  });

  it('leaves out the copyright line when no author is known', () => {
    const text = reconstructLicenseText('MIT');

    expect(text).toContain('Permission is hereby granted, free of charge');
    expect(text).not.toContain('Copyright');
    expect(text).not.toContain('{{copyright}}');
  });

  it('puts the copyright above texts that carry no placeholder', () => {
    const text = reconstructLicenseText('Apache-2.0', 'Jane Doe');

    expect(text?.split('\n')[0]).toBe('Copyright (c) Jane Doe');
    expect(text).toContain('TERMS AND CONDITIONS FOR USE, REPRODUCTION');
  });

  it('has no canonical text for a license it does not carry', () => {
    expect(reconstructLicenseText('MPL-2.0', 'Jane Doe')).toBeUndefined();
  });

  it('refuses an identifier that is not a plain SPDX id', () => {
    expect(reconstructLicenseText('../../etc/passwd')).toBeUndefined();
  });
});

describe('resolvePackage', () => {
  it('keeps the declared license when no decision applies', () => {
    const resolved = resolve();

    expect(resolved.license).toBe('MIT');
    expect(resolved.declaredLicense).toBeUndefined();
    expect(resolved.licenseTextReconstructed).toBe(false);
  });

  it('records both licenses when a decision applies', () => {
    const resolved = resolve(
      { name: 'dompurify', license: '(MPL-2.0 OR Apache-2.0)' },
      dompurifyDecision
    );

    expect(resolved.license).toBe('Apache-2.0');
    expect(resolved.declaredLicense).toBe('(MPL-2.0 OR Apache-2.0)');
    expect(resolved.licenseNote).toContain('elects Apache-2.0');
  });

  it('reconstructs the text of a package shipping no license file', () => {
    const resolved = resolve({
      name: 'tiny-case',
      licenseText: undefined,
      author: 'Jason Quense',
    });

    expect(resolved.licenseTextReconstructed).toBe(true);
    expect(resolved.licenseText).toContain('Copyright (c) Jason Quense');
  });

  it('leaves the text out when nothing can reconstruct it', () => {
    const resolved = resolve({
      name: 'odd',
      license: 'SEE LICENSE IN FILE',
      licenseText: undefined,
    });

    expect(resolved.licenseText).toBeUndefined();
    expect(resolved.licenseTextReconstructed).toBe(false);
  });
});

describe('thirdPartyLicensesConfig', () => {
  // The election is the one decision in the notices that a reader cannot
  // verify from the bundle alone, so losing it has to fail a test.
  it('elects Apache-2.0 for the dual-licensed dompurify', () => {
    const decision = thirdPartyLicensesConfig.licenseDecisions?.dompurify;

    expect(decision?.license).toBe('Apache-2.0');
    expect(decision?.note).toContain('(MPL-2.0 OR Apache-2.0)');
  });

  it('lists the Sass-inlined packages the bundler cannot see', () => {
    expect(thirdPartyLicensesConfig.sassResolvedPackages).toContain(
      'hds-design-tokens'
    );
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
    const packages = [
      resolve({ name: 'zod' }),
      resolve({ name: 'react', version: '19.2.6' }),
      resolve({ name: 'react', version: '18.0.0' }),
    ];

    const output = renderNotices(packages, config());

    expect(output.indexOf('react@18.0.0')).toBeLessThan(
      output.indexOf('react@19.2.6')
    );
    expect(output.indexOf('react@19.2.6')).toBeLessThan(output.indexOf('zod@'));
    expect(renderNotices([...packages].reverse(), config())).toBe(output);
  });

  it('includes the license text of a package verbatim', () => {
    const output = renderNotices(
      [
        resolve({
          licenseText: 'Copyright (c) Someone\nPermission is granted.\n',
        }),
      ],
      config()
    );

    expect(output).toContain('Copyright (c) Someone\nPermission is granted.');
  });

  it('marks a reconstructed notice as reconstructed', () => {
    const output = renderNotices(
      [resolve({ licenseText: undefined, author: 'Jason Quense' })],
      config()
    );

    expect(output).toContain('ships no license file');
    expect(output).toContain('Copyright (c) Jason Quense');
    expect(output).toContain('Permission is hereby granted, free of charge');
  });

  it('states the elected license and what the package declares', () => {
    const output = renderNotices(
      [
        resolve(
          { name: 'dompurify', license: '(MPL-2.0 OR Apache-2.0)' },
          dompurifyDecision
        ),
      ],
      config()
    );

    expect(output).toContain('License: Apache-2.0');
    expect(output).toContain('Declared as: (MPL-2.0 OR Apache-2.0)');
    // The election is what removes the MPL obligation, so the notice for it
    // must not be emitted for this component.
    expect(output).not.toContain('MPL-2.0 section 3.2 notice');
  });

  it('gives MPL-2.0 components a section 3.2 source notice', () => {
    const output = renderNotices(
      [
        resolve({
          name: '@jonkoops/matomo-tracker',
          version: '0.7.0',
          license: 'MPL-2.0',
          repository: 'https://github.com/jonkoops/matomo-tracker',
        }),
      ],
      config()
    );
    // The notice is wrapped, so phrases are matched without its line breaks.
    const unwrapped = output.replace(/\s+/g, ' ');

    expect(unwrapped).toContain('MPL-2.0 section 3.2 notice');
    expect(unwrapped).toContain('https://github.com/jonkoops/matomo-tracker');
    expect(unwrapped).toContain('npm pack @jonkoops/matomo-tracker@0.7.0');
  });

  it('falls back to the npm tarball when a package names no repository', () => {
    const output = renderNotices(
      [resolve({ license: 'MPL-2.0', repository: '' })],
      config()
    );

    expect(output.replace(/\s+/g, ' ')).toContain(
      'https://registry.npmjs.org/example/-/example-1.0.0.tgz'
    );
  });

  it('does not add an MPL notice to permissive components', () => {
    expect(renderNotices([resolve()], config())).not.toContain('section 3.2');
  });

  it('carries the license of the application itself', () => {
    const output = renderNotices(
      [resolve()],
      config(),
      'MIT License\n\nCopyright (c) 2024 City of Helsinki\n'
    );

    expect(output).toContain('distributed under the following license');
    expect(output).toContain('Copyright (c) 2024 City of Helsinki');
    expect(output).toContain('Source: https://github.com/example/app');
  });
});

describe('renderManifest', () => {
  it('describes a package the same way the notices do', () => {
    const resolved = resolve(
      { name: 'dompurify', license: '(MPL-2.0 OR Apache-2.0)' },
      dompurifyDecision
    );
    const [entry] = JSON.parse(renderManifest([resolved]));

    expect(entry).toMatchObject({
      name: 'dompurify',
      version: '1.0.0',
      license: 'Apache-2.0',
      declaredLicense: '(MPL-2.0 OR Apache-2.0)',
      source: 'https://registry.npmjs.org/example/-/example-1.0.0.tgz',
    });
    expect(entry.licenseNote).toContain('elects Apache-2.0');
  });

  it('flags a reconstructed license text so an audit can tell', () => {
    const [reconstructed] = JSON.parse(
      renderManifest([resolve({ licenseText: undefined, author: 'Jane Doe' })])
    );
    const [shipped] = JSON.parse(renderManifest([resolve()]));

    expect(reconstructed.licenseTextReconstructed).toBe(true);
    expect(reconstructed.licenseText).toContain('Copyright (c) Jane Doe');
    expect(shipped.licenseTextReconstructed).toBeUndefined();
  });

  it('sorts entries and stays byte-identical between runs', () => {
    const packages = [
      resolve({ name: 'zod' }),
      resolve({ name: 'react', version: '19.2.6' }),
      resolve({ name: 'react', version: '18.0.0' }),
    ];
    const output = renderManifest(packages);

    expect(
      JSON.parse(output).map((entry: { name: string }) => entry.name)
    ).toEqual(['react', 'react', 'zod']);
    expect(renderManifest([...packages].reverse())).toBe(output);
  });
});
