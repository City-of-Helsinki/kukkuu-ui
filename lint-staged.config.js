import { ESLint } from 'eslint';

/**
 * Remove files that are ignored by ESLint
 *
 * Based on lint-staged's README section
 * "How can I ignore files from .eslintignore?" for ESLint >= 7:
 * https://github.com/lint-staged/lint-staged/blob/v15.3.0/README.md#how-can-i-ignore-files-from-eslintignore
 *
 * NOTE:
 *     Please update to use eslint's `--no-warn-ignored` parameter instead when
 *     using ESLint >= 8.5.10 and Flat ESLint config (The parameter requires
 *     Flat ESLint config to work). See lint-staged's README.md for details.
 */
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    })
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};

export default {
  '**/*.{js,jsx,ts,tsx,cjs,mjs}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    return [
      `yarn format:code --max-warnings=0 ${filesToLint}`,
      `yarn test:staged ${filesToLint}`,
    ];
  },
  '**/*.{html,json,css,scss,md,mdx}': ['yarn format:markup'],
};
