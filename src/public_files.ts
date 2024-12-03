/**
 * This file is used to define the public directories/files available in the project.
 *
 * Files in the public directory are served at the root path,
 * e.g. /icons/svg/ actually points to /public/icons/svg/
 */

export const publicSvgIconDir = '/icons/svg';
export const publicPartnersIconDir = '/icons/partners';

export type PublicSvgIconPath = `${typeof publicSvgIconDir}/${string}.svg`;
export type PublicPartnersIconPath =
  `${typeof publicPartnersIconDir}/${string}.${'png' | 'svg'}`;

export const publicSvgIconPaths = {
  adultFace: `${publicSvgIconDir}/adultFace.svg`,
  adultFaceHappy: `${publicSvgIconDir}/adultFaceHappy.svg`,
  adultFaceHappyTransparent: `${publicSvgIconDir}/adultFaceHappyTransparent.svg`,
  childFaceHappy: `${publicSvgIconDir}/childFaceHappy.svg`,
  envelopeWithStars: `${publicSvgIconDir}/envelopeWithStars.svg`,
  homeKid: `${publicSvgIconDir}/homeKid.svg`,
  homeTheater: `${publicSvgIconDir}/homeTheater.svg`,
  tada: `${publicSvgIconDir}/tada.svg`,
} as const satisfies Record<string, PublicSvgIconPath>;
