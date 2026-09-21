/* eslint-disable no-console -- build-time diagnostics, as in the other build scripts */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  createViteLicensePlugin,
  type LicenseMeta,
} from 'rollup-license-plugin';
import type { Plugin } from 'vite';

/**
 * Emits the third-party license notices that ship with the production build.
 *
 * MIT, ISC, BSD and Apache-2.0 all require the copyright notice and the
 * license text to travel with the distributed code, and MPL-2.0 section 3.2
 * additionally requires telling recipients where the source of the
 * MPL-covered files can be obtained. A minified bundle carries none of that,
 * so the notices are written next to it as a plain text file that is served
 * from the application root, accompanied by the same data as JSON for
 * automated license audits.
 *
 * Finding the bundled packages is delegated to rollup-license-plugin; this
 * module only decides what the notices say. Nothing here is specific to this
 * repository -- everything that is lives in thirdPartyLicenses.config.ts.
 */

const DEFAULT_NOTICES_FILE_NAME = 'third-party-licenses.txt';
const DEFAULT_MANIFEST_FILE_NAME = 'oss-licenses.json';
const LICENSE_TEXT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'licenseTexts'
);
const COPYRIGHT_PLACEHOLDER = '{{copyright}}';
const SEPARATOR = '-'.repeat(78);
const WRAP_COLUMNS = 78;

/** A license identifier that replaces the one a package declares. */
export type LicenseDecision = { license: string; note: string };

export type ThirdPartyLicensesConfig = {
  /** Browsable URL of this repository, named as the source of the app. */
  repositoryUrl: string;
  /**
   * Packages whose declared license is replaced in the notices, keyed by
   * package name. Used to elect one license of a dual-licensed package, or to
   * record the SPDX identifier matching the license file of a package that
   * declares an ambiguous one. The note says why, since a reader cannot check
   * either from the bundle.
   */
  licenseDecisions?: Record<string, LicenseDecision>;
  /**
   * Distributed packages that stay invisible to the bundler, because Sass
   * resolves and inlines them while compiling the stylesheets.
   */
  sassResolvedPackages?: string[];
  /** Name of the human-readable notices file in the build output. */
  noticesFileName?: string;
  /**
   * Name of the machine-readable manifest in the build output, for license
   * audit tooling. Set to false to emit only the notices file.
   */
  manifestFileName?: string | false;
};

/** One bundled package, after the configured decisions have been applied. */
export type ResolvedPackage = {
  name: string;
  version: string;
  /** The license this distribution relies on. */
  license: string;
  /** Only present when it differs from the license above. */
  declaredLicense?: string;
  /** Why the two differ. */
  licenseNote?: string;
  author?: string;
  repository?: string;
  /** Package tarball on the npm registry. */
  source: string;
  licenseText?: string;
  /**
   * Whether the license text was rebuilt from the canonical text of the
   * declared license, because the package ships no license file.
   */
  licenseTextReconstructed: boolean;
};

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

/** The author of a package, as a plain "Name <email>" string. */
export function formatAuthor(
  author: LicenseMeta['author']
): string | undefined {
  if (typeof author === 'string') {
    return author.trim() || undefined;
  }
  if (author && typeof author === 'object' && typeof author.name === 'string') {
    return author.email
      ? `${author.name} <${author.email}>`
      : author.name || undefined;
  }
  return undefined;
}

const canonicalTextCache = new Map<string, string | undefined>();

/**
 * The canonical text of a license, kept in licenseTexts/ so that a package
 * shipping no license file of its own can still be given one.
 */
function readCanonicalText(license: string): string | undefined {
  if (!canonicalTextCache.has(license)) {
    // The identifier comes from a package.json and ends up in a path, so
    // anything that is not a plain SPDX identifier is refused.
    const safe = /^[\w.-]+$/.test(license);
    let text: string | undefined;
    try {
      text = safe
        ? fs.readFileSync(path.join(LICENSE_TEXT_DIR, `${license}.txt`), 'utf8')
        : undefined;
    } catch {
      text = undefined;
    }
    canonicalTextCache.set(license, text);
  }
  return canonicalTextCache.get(license);
}

/**
 * Rebuilds the notice of a package that ships no license file, from the
 * license it declares and the author it names. Returns undefined when no
 * canonical text is available for that license.
 */
export function reconstructLicenseText(
  license: string,
  author?: string
): string | undefined {
  const canonical = readCanonicalText(license);
  if (!canonical) {
    return undefined;
  }

  const copyright = author ? `Copyright (c) ${author}` : undefined;
  if (canonical.includes(COPYRIGHT_PLACEHOLDER)) {
    return copyright
      ? canonical.replace(`Copyright (c) ${COPYRIGHT_PLACEHOLDER}`, copyright)
      : // Without an author there is no copyright line to state, so the
        // canonical text is given without one.
        canonical
          .split('\n')
          .filter((line) => !line.includes(COPYRIGHT_PLACEHOLDER))
          .join('\n')
          .replace(/\n{3,}/g, '\n\n');
  }
  return copyright ? `${copyright}\n\n${canonical}` : canonical;
}

/** Packages already warned about, so a warning is printed only once. */
const warned = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (!warned.has(key)) {
    warned.add(key);
    console.warn(`[third-party-licenses] ${message}`);
  }
}

/**
 * Applies the configured decisions to one package, so that the notices and
 * the manifest describe it identically.
 */
export function resolvePackage(
  pkg: LicenseMeta,
  config: ThirdPartyLicensesConfig
): ResolvedPackage {
  const decision = config.licenseDecisions?.[pkg.name];
  const license = decision?.license ?? pkg.license;
  const author = formatAuthor(pkg.author);
  const id = `${pkg.name}@${pkg.version}`;

  const resolved: ResolvedPackage = {
    name: pkg.name,
    version: pkg.version,
    license,
    declaredLicense: decision ? pkg.license : undefined,
    licenseNote: decision?.note,
    author,
    repository: pkg.repository || undefined,
    source: pkg.source,
    licenseTextReconstructed: false,
  };

  if (pkg.licenseText) {
    // Leading blank lines only, so that an indented first line such as the
    // centred Apache-2.0 title keeps its indentation.
    resolved.licenseText = pkg.licenseText
      .replace(/^\n+/, '')
      .replace(/\s+$/, '');
    return resolved;
  }

  const reconstructed = reconstructLicenseText(license, author);
  if (!reconstructed) {
    warnOnce(
      id,
      `${id} ships no license file and no canonical text for "${license}" ` +
        'is available, so only the license it declares can be stated.'
    );
    return resolved;
  }
  if (!author) {
    warnOnce(
      id,
      `${id} ships no license file and names no author, so its notice ` +
        'carries no copyright line.'
    );
  }

  resolved.licenseText = reconstructed.replace(/\s+$/, '');
  resolved.licenseTextReconstructed = true;
  return resolved;
}

function renderMozillaPublicLicenseNotice(pkg: ResolvedPackage): string {
  return wrapText(
    'MPL-2.0 section 3.2 notice: this component is distributed here in ' +
      'executable form as part of the application bundle. The complete ' +
      'source code of its MPL-covered files, in exactly the version listed ' +
      `above, is available at ${pkg.repository ?? pkg.source} and from the ` +
      `npm registry with "npm pack ${pkg.name}@${pkg.version}".`
  );
}

function renderEntry(pkg: ResolvedPackage): string {
  const lines = [
    SEPARATOR,
    `${pkg.name}@${pkg.version}`,
    `License: ${pkg.license}`,
  ];
  if (pkg.declaredLicense) {
    lines.push(`Declared as: ${pkg.declaredLicense}`);
  }
  lines.push('');

  if (pkg.licenseNote) {
    lines.push(wrapText(pkg.licenseNote), '');
  }
  if (/\bMPL-2\.0\b/.test(pkg.license)) {
    lines.push(renderMozillaPublicLicenseNotice(pkg), '');
  }

  if (!pkg.licenseText) {
    lines.push(
      wrapText(
        'This package ships no license file. The identifier above is the ' +
          `one ${pkg.name} declares in its package.json, and the canonical ` +
          'text of that license applies.'
      )
    );
  } else if (pkg.licenseTextReconstructed) {
    lines.push(
      wrapText(
        'This package ships no license file. The notice below was ' +
          `reconstructed from the ${pkg.license} license it declares in its ` +
          (pkg.author
            ? 'package.json and the author it names there.'
            : 'package.json. It names no author, so no copyright holder is ' +
              'stated.')
      ),
      '',
      pkg.licenseText
    );
  } else {
    lines.push(pkg.licenseText);
  }

  return lines.join('\n');
}

function byNameAndVersion(a: ResolvedPackage, b: ResolvedPackage): number {
  return a.name === b.name
    ? a.version.localeCompare(b.version)
    : a.name.localeCompare(b.name);
}

/**
 * Renders the human-readable notices. The output is sorted and free of
 * timestamps, so an unchanged dependency set produces an unchanged file.
 */
export function renderNotices(
  packages: ResolvedPackage[],
  config: ThirdPartyLicensesConfig,
  projectLicenseText?: string
): string {
  // The license of the application requires its own permission notice to
  // travel with the code as well, and the deployed image carries nothing but
  // the build output.
  const header = [
    'Third-party license notices',
    '===========================',
    '',
    'The application itself is distributed under the following license.',
    // Kept on an unwrapped line of its own so the link stays clickable.
    `Source: ${config.repositoryUrl}`,
    ...(projectLicenseText ? ['', projectLicenseText.replace(/\s+$/, '')] : []),
  ].join('\n');

  return [
    header,
    ...[...packages].sort(byNameAndVersion).map(renderEntry),
    SEPARATOR,
    '',
  ].join('\n\n');
}

/**
 * Renders the same packages as JSON, for license audit tooling. The shape
 * follows the manifest rollup-license-plugin emits by default, with the
 * decisions of this build recorded in the additional fields.
 */
export function renderManifest(packages: ResolvedPackage[]): string {
  const entries = [...packages].sort(byNameAndVersion).map((pkg) => ({
    name: pkg.name,
    version: pkg.version,
    author: pkg.author,
    repository: pkg.repository,
    source: pkg.source,
    license: pkg.license,
    declaredLicense: pkg.declaredLicense,
    licenseNote: pkg.licenseNote,
    licenseText: pkg.licenseText,
    licenseTextReconstructed: pkg.licenseTextReconstructed || undefined,
  }));
  return `${JSON.stringify(entries, null, 2)}\n`;
}

/** Reads the license file of the project itself, when it has one. */
function readProjectLicenseText(): string | undefined {
  const fileName = fs
    .readdirSync(process.cwd())
    .filter((name) => /^(licen[cs]e|copying)([.-].*)?$/i.test(name))
    .sort()[0];
  if (!fileName) {
    warnOnce(
      'project-license',
      'the project has no license file, so the notices cannot carry the ' +
        'license of the application itself.'
    );
    return undefined;
  }
  return fs.readFileSync(path.join(process.cwd(), fileName), 'utf8');
}

/**
 * Collects the licenses of every npm package that contributes code to the
 * build and emits them as a text file, and optionally a JSON manifest, in
 * the build output.
 */
export function thirdPartyLicenses(config: ThirdPartyLicensesConfig): Plugin {
  const resolveAll = (packages: LicenseMeta[]) =>
    packages.map((pkg) => resolvePackage(pkg, config));

  const manifestFileName =
    config.manifestFileName === undefined
      ? DEFAULT_MANIFEST_FILE_NAME
      : config.manifestFileName;

  return createViteLicensePlugin({
    outputFilename: false,
    additionalFiles: {
      [config.noticesFileName ?? DEFAULT_NOTICES_FILE_NAME]: (packages) =>
        renderNotices(resolveAll(packages), config, readProjectLicenseText()),
      ...(manifestFileName
        ? {
            [manifestFileName]: (packages) =>
              renderManifest(resolveAll(packages)),
          }
        : {}),
    },
    includePackages: () =>
      (config.sassResolvedPackages ?? []).map((name) => {
        const packageDir = path.resolve(process.cwd(), 'node_modules', name);
        if (!fs.existsSync(packageDir)) {
          throw new Error(
            `Distributed package "${name}" was not found in node_modules, ` +
              'so its license would be missing from the third-party notices.'
          );
        }
        return packageDir;
      }),
  });
}
