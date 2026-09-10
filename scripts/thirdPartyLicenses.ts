import fs from 'fs';
import path from 'path';

import type { Plugin } from 'vite';

/**
 * Emits the third-party license notices that ship with the production build.
 *
 * The MIT, BSD, ISC and Apache-2.0 licenses of the bundled dependencies all
 * require their copyright and license text to travel with the distributed
 * code, and MPL-2.0 section 3.2 additionally requires telling recipients where
 * the source of the MPL-covered files can be obtained. A minified bundle
 * carries none of that, so the notices are written next to it as a plain text
 * file that is served from the application root.
 */

const OUTPUT_FILE_NAME = 'third-party-licenses.txt';
const PROJECT_REPOSITORY_URL = 'https://github.com/City-of-Helsinki/kukkuu-ui';
const LICENSE_FILE_PATTERN = /^(licen[cs]e|copying)([.-].*)?$/i;
const SEPARATOR = '-'.repeat(78);
const WRAP_COLUMNS = 78;

export const UNKNOWN_LICENSE = 'UNKNOWN';

/**
 * Packages that are distributed but stay invisible to Rollup's module graph,
 * because Sass resolves and inlines them while compiling the stylesheets.
 * Without this list their licenses would be missing from the notices.
 */
const SASS_RESOLVED_PACKAGES = ['hds-design-tokens'];

/** A license identifier that replaces the one a package declares. */
type LicenseOverride = { license: string; note: string };

/**
 * Elections for dependencies offered under more than one license. The
 * copyright holder grants every listed alternative, so we record which one
 * this distribution relies on instead of leaving the choice open.
 */
const LICENSE_ELECTIONS: Record<string, LicenseOverride> = {
  dompurify: {
    license: 'Apache-2.0',
    note:
      'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
      'distribution elects Apache-2.0, so the MPL-2.0 obligations do not ' +
      'apply to this component.',
  },
};

/**
 * Corrections for dependencies whose package.json states a license that is
 * ambiguous or not a valid SPDX identifier. Unlike an election, nothing is
 * being chosen here: the license file already settles which license applies,
 * and this only records the identifier that matches that text.
 *
 * Every package in the current bundle declares a valid SPDX identifier, so
 * the list is empty. Add an entry when one stops doing so, and only after
 * reading that package's own license file.
 */
const LICENSE_CORRECTIONS: Record<string, LicenseOverride> = {};

export type PackageManifest = {
  name?: unknown;
  version?: unknown;
  license?: unknown;
  licenses?: unknown;
  repository?: unknown;
  homepage?: unknown;
};

export type PackageLicense = {
  name: string;
  version: string;
  /** The license this distribution relies on. */
  license: string;
  /** The license expression declared by the package itself. */
  declaredLicense: string;
  /** Why the license above differs from the declared one, when it does. */
  licenseNote?: string;
  sourceUrl?: string;
  licenseText?: string;
};

/**
 * Strips the query strings and virtual-module prefixes that Rollup and Vite
 * add to module ids, leaving a plain file path.
 */
export function cleanModuleId(moduleId: string): string {
  const withoutQuery = moduleId.split('?')[0].replace(/^\0/, '');
  // Virtual modules are prefixed, e.g. "commonjs-proxy:/path/to/file.js". The
  // prefix is required to be longer than one character so that Windows drive
  // letters are left alone.
  const prefixed = /^[\w-]{2,}:(\/.*)$/.exec(withoutQuery);
  return prefixed ? prefixed[1] : withoutQuery;
}

/**
 * An installed package always sits directly in a node_modules directory,
 * either as "node_modules/name" or as "node_modules/@scope/name". Nothing
 * deeper can be a package root, however complete the manifest it ships looks.
 */
export function isPackageRootLocation(dir: string): boolean {
  const parent = path.posix.dirname(dir);
  const parentName = path.posix.basename(parent);

  if (path.posix.basename(dir) === 'node_modules') {
    return false;
  }
  if (parentName === 'node_modules') {
    return true;
  }
  return (
    parentName.startsWith('@') &&
    path.posix.basename(path.posix.dirname(parent)) === 'node_modules'
  );
}

/**
 * Walks up from a bundled module to the root of the npm package that owns it.
 * Returns null for application sources and virtual modules.
 */
export function findPackageRoot(
  moduleId: string,
  isPackageRoot: (dir: string) => boolean
): string | null {
  const filePath = cleanModuleId(moduleId);
  if (!filePath.includes('/node_modules/')) {
    return null;
  }

  let dir = path.posix.dirname(filePath);
  while (dir.includes('/node_modules/') || dir.endsWith('/node_modules')) {
    // Packages ship nested package.json files for subpath entry points and
    // for fields such as "sideEffects". Most name no version, but some name
    // both a version and a subpath as the name -- @hookform/resolvers/yup
    // does -- so the manifest alone cannot tell them apart from a published
    // package. Where the directory sits can.
    if (isPackageRootLocation(dir) && isPackageRoot(dir)) {
      return dir;
    }
    dir = path.posix.dirname(dir);
  }
  return null;
}

/**
 * Reads the license expression a package declares, supporting the legacy
 * "licenses" array and object forms still found in older packages.
 */
export function readDeclaredLicense(manifest: PackageManifest): string {
  const { license, licenses } = manifest;

  if (typeof license === 'string' && license.length > 0) {
    return license;
  }
  if (typeof license === 'object' && license !== null) {
    const { type } = license as { type?: unknown };
    if (typeof type === 'string' && type.length > 0) {
      return type;
    }
  }
  if (Array.isArray(licenses)) {
    const types = licenses
      .map((entry) =>
        typeof entry === 'string' ? entry : (entry as { type?: unknown })?.type
      )
      .filter((type): type is string => typeof type === 'string' && type !== '');
    if (types.length > 0) {
      return types.length > 1 ? `(${types.join(' OR ')})` : types[0];
    }
  }
  return UNKNOWN_LICENSE;
}

/**
 * Turns the many shapes of the package.json "repository" field into a plain
 * browsable URL, pointing at the subdirectory when the package lives in a
 * monorepo.
 */
export function normalizeSourceUrl(
  repository: unknown,
  fallback?: unknown
): string | undefined {
  const raw =
    typeof repository === 'string'
      ? repository
      : (repository as { url?: unknown })?.url;

  if (typeof raw !== 'string' || raw.length === 0) {
    return typeof fallback === 'string' && fallback.length > 0
      ? fallback
      : undefined;
  }

  let url = raw
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/^ssh:\/\/git@/, 'https://')
    .replace(/^git@([^:]+):/, 'https://$1/')
    .replace(/\.git$/, '');

  if (url.startsWith('github:')) {
    url = `https://github.com/${url.slice('github:'.length)}`;
  } else if (/^[\w-]+\/[\w.-]+$/.test(url)) {
    url = `https://github.com/${url}`;
  }

  const directory = (repository as { directory?: unknown })?.directory;
  if (
    typeof directory === 'string' &&
    directory.length > 0 &&
    url.includes('github.com')
  ) {
    url = `${url}/tree/HEAD/${directory}`;
  }
  return url;
}

function isMozillaPublicLicense(license: string): boolean {
  return /\bMPL-2\.0\b/.test(license);
}

/** Wraps generated prose so the notices stay readable in a plain text file. */
export function wrapText(text: string, columns = WRAP_COLUMNS): string {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line.length === 0) {
      line = word;
    } else if (`${line} ${word}`.length <= columns) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line.length > 0) {
    lines.push(line);
  }
  return lines.join('\n');
}

function renderMozillaPublicLicenseNotice(entry: PackageLicense): string {
  const source =
    entry.sourceUrl ??
    `https://www.npmjs.com/package/${entry.name}/v/${entry.version}`;
  return (
    'MPL-2.0 section 3.2 notice: this component is distributed here in ' +
    'executable form as part of the application bundle. The complete source ' +
    'code of its MPL-covered files, in exactly the version listed above, is ' +
    `available at ${source} and from the npm registry with ` +
    `"npm pack ${entry.name}@${entry.version}".`
  );
}

function renderMissingLicenseTextNotice(entry: PackageLicense): string {
  return (
    'This package ships no license text of its own. The license identifier ' +
    `above is the one ${entry.name} declares in its package.json, and the ` +
    'canonical text of that license applies.'
  );
}

function renderHeader(
  componentCount: number,
  projectLicenseText?: string
): string {
  // The MIT license of the application requires its own permission notice to
  // travel with the code as well, and the deployed image carries nothing but
  // the build output. Reproducing the license file here keeps that notice in
  // the distribution without duplicating its text in this file.
  const attribution = projectLicenseText
    ? [
        'The application itself is distributed under the following license.',
        // Kept on an unwrapped line of its own so the link stays clickable.
        `Source: ${PROJECT_REPOSITORY_URL}`,
        '',
        projectLicenseText.replace(/\s+$/, ''),
      ]
    : [
        'The application itself is licensed under the MIT License.',
        'Copyright (c) 2024 City of Helsinki',
        `Source: ${PROJECT_REPOSITORY_URL}`,
      ];

  return [
    'Third-party license notices',
    '===========================',
    '',
    wrapText(
      'This file lists the third-party open source components included in ' +
        'the JavaScript and CSS bundles of this application, together with ' +
        'the license each of them is distributed under. It is generated ' +
        'during the production build from the modules that end up in the ' +
        'bundle, so it describes exactly this build.'
    ),
    '',
    ...attribution,
    '',
    `Components: ${componentCount}`,
  ].join('\n');
}

function renderEntry(entry: PackageLicense): string {
  const lines = [
    SEPARATOR,
    `${entry.name}@${entry.version}`,
    `License: ${entry.license}`,
  ];

  if (entry.license !== entry.declaredLicense) {
    lines.push(`Declared as: ${entry.declaredLicense}`);
  }
  if (entry.sourceUrl) {
    lines.push(`Source: ${entry.sourceUrl}`);
  }
  lines.push('');

  if (entry.licenseNote) {
    lines.push(wrapText(entry.licenseNote), '');
  }
  if (isMozillaPublicLicense(entry.license)) {
    lines.push(wrapText(renderMozillaPublicLicenseNotice(entry)), '');
  }

  lines.push(
    entry.licenseText
      ? entry.licenseText.replace(/\s+$/, '')
      : wrapText(renderMissingLicenseTextNotice(entry))
  );
  return lines.join('\n');
}

/**
 * Renders the whole notices file. The output is sorted and free of
 * timestamps, so an unchanged dependency set produces an unchanged file.
 */
export function renderNotices(
  entries: PackageLicense[],
  projectLicenseText?: string
): string {
  const sorted = [...entries].sort((a, b) =>
    a.name === b.name
      ? a.version.localeCompare(b.version)
      : a.name.localeCompare(b.name)
  );
  return [
    renderHeader(sorted.length, projectLicenseText),
    ...sorted.map(renderEntry),
    SEPARATOR,
    '',
  ].join('\n\n');
}

const manifestCache = new Map<string, PackageManifest | null>();

function readManifest(dir: string): PackageManifest | null {
  const cached = manifestCache.get(dir);
  if (cached !== undefined) {
    return cached;
  }

  let manifest: PackageManifest | null;
  try {
    manifest = JSON.parse(
      fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
    ) as PackageManifest;
  } catch {
    manifest = null;
  }
  manifestCache.set(dir, manifest);
  return manifest;
}

function isPackageRootOnDisk(dir: string): boolean {
  const manifest = readManifest(dir);
  return (
    typeof manifest?.name === 'string' && typeof manifest?.version === 'string'
  );
}

function readLicenseText(packageDir: string): string | undefined {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(packageDir);
  } catch {
    return undefined;
  }

  const licenseFile = fileNames
    .filter((fileName) => LICENSE_FILE_PATTERN.test(fileName))
    .sort()[0];
  if (!licenseFile) {
    return undefined;
  }

  try {
    const filePath = path.join(packageDir, licenseFile);
    if (!fs.statSync(filePath).isFile()) {
      return undefined;
    }
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return undefined;
  }
}

function readPackageLicense(packageDir: string): PackageLicense {
  const manifest = readManifest(packageDir) ?? {};
  const name = typeof manifest.name === 'string' ? manifest.name : packageDir;
  const version =
    typeof manifest.version === 'string' ? manifest.version : 'unknown';
  const declaredLicense = readDeclaredLicense(manifest);
  const override = LICENSE_ELECTIONS[name] ?? LICENSE_CORRECTIONS[name];

  return {
    name,
    version,
    license: override?.license ?? declaredLicense,
    declaredLicense,
    licenseNote: override?.note,
    sourceUrl: normalizeSourceUrl(manifest.repository, manifest.homepage),
    licenseText: readLicenseText(packageDir),
  };
}

/**
 * Collects the licenses of every npm package that contributes code to the
 * build and emits them as a text file in the build output.
 */
export function thirdPartyLicenses(): Plugin {
  return {
    name: 'kukkuu-third-party-licenses',
    apply: 'build',
    generateBundle(_options, bundle) {
      const packageRoots = new Set<string>();
      const addModule = (moduleId: string) => {
        const packageRoot = findPackageRoot(moduleId, isPackageRootOnDisk);
        if (packageRoot) {
          packageRoots.add(packageRoot);
        }
      };

      // The chunk modules cover the emitted JavaScript, and the module graph
      // is needed on top of them because CSS-only packages such as hds-core
      // never show up in a JavaScript chunk even though their styles ship.
      for (const moduleId of this.getModuleIds()) {
        addModule(moduleId);
      }
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          Object.keys(output.modules).forEach(addModule);
        }
      }
      for (const name of SASS_RESOLVED_PACKAGES) {
        const packageRoot = path.join(process.cwd(), 'node_modules', name);
        if (isPackageRootOnDisk(packageRoot)) {
          packageRoots.add(packageRoot);
        } else {
          this.warn(
            `Distributed package "${name}" was not found in node_modules, ` +
              'so its license is missing from the notices.'
          );
        }
      }

      const entries = [...packageRoots].map(readPackageLicense);
      for (const entry of entries) {
        if (entry.license === UNKNOWN_LICENSE) {
          this.warn(
            `Bundled package ${entry.name}@${entry.version} declares no ` +
              'license, so the notices cannot state one for it.'
          );
        }
      }

      const projectLicenseText = readLicenseText(process.cwd());
      if (!projectLicenseText) {
        this.warn(
          'No license file was found in the project root, so the notices ' +
            'cannot carry the license text of the application itself.'
        );
      }

      this.emitFile({
        type: 'asset',
        fileName: OUTPUT_FILE_NAME,
        source: renderNotices(entries, projectLicenseText),
      });
    },
  };
}
