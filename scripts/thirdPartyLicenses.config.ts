import type { ThirdPartyLicensesConfig } from '@city-of-helsinki/license-notices';

/**
 * Everything about the third-party license notices that is specific to this
 * repository. The generator itself comes from the license-notices package and
 * knows nothing about this project.
 */
export const thirdPartyLicensesConfig: ThirdPartyLicensesConfig = {
  repositoryUrl: 'https://github.com/City-of-Helsinki/kukkuu-ui',

  licenseDecisions: {
    dompurify: {
      license: 'Apache-2.0',
      note:
        'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
        'distribution elects Apache-2.0, so the MPL-2.0 obligations do not ' +
        'apply to this component.',
    },
  },

  sassResolvedPackages: ['hds-design-tokens'],
};
