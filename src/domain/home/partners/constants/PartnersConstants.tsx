import { logoFi as helIcon, logoSv as helIconSv } from 'hds-react';

import { Partner } from '../types/partner';

const helsinkiFiUrl =
  'https://www.hel.fi/fi/paatoksenteko-ja-hallinto/kaupungin-organisaatio/toimialat/kulttuurin-ja-vapaa-ajan-toimiala';

const helsinkiSvUrl =
  'https://www.hel.fi/sv/beslutsfattande-och-forvaltning/stadens-organisation/sektorer/kultur-och-fritidssektorn';

const helsinkiEnUrl =
  'https://www.hel.fi/en/decision-making/city-organization/divisions/culture-and-leisure-division';

// Name, icon file name and translation key is created from partner's domain
// name without .fi and dash.
// Examples:
// teatteri-ilmio.fi -> teatteriilmio
// hel.fi -> hel
export const mainPartnerList: Partner[] = [
  {
    name: 'hel',
    icon: helIcon,
    altLangIcons: { sv: helIconSv },
    url: {
      fi: helsinkiFiUrl,
      sv: helsinkiSvUrl,
      en: helsinkiEnUrl,
    },
  },
  {
    name: 'jaes',
    icon: '/icons/partners/jaes-logo-fi.svg',
    iconClassName: 'jaes-icon',
    altLangIcons: {
      en: '/icons/partners/jaes-logo-en.svg',
      sv: '/icons/partners/jaes-logo-sv.svg',
    },
    url: {
      fi: 'https://jaes.fi/',
      sv: 'https://jaes.fi/sv/',
      en: 'https://jaes.fi/en/',
    },
  },
];

export const partnerList: Partner[] = [
  {
    name: 'amosrex',
    icon: '/icons/partners/amosrex.png',
    url: {
      fi: 'https://amosrex.fi/',
      sv: 'https://amosrex.fi/sv/',
      en: 'https://amosrex.fi/en/',
    },
  },
  {
    name: 'cirko',
    icon: '/icons/partners/cirko.png',
    url: {
      fi: 'https://cirko.fi/',
      sv: 'https://cirko.fi/sv/',
      en: 'https://cirko.fi/en/',
    },
  },
  {
    name: 'dot',
    icon: '/icons/partners/dotdot.png',
    url: {
      fi: 'https://dotdot.fi/suomeksi/',
      sv: 'https://dotdot.fi/start/',
      en: 'https://dotdot.fi/in_english/',
    },
  },
  {
    name: 'designmuseum',
    icon: '/icons/partners/designmuseum.png',
    url: {
      fi: 'https://www.designmuseum.fi/fi/',
      sv: 'https://www.designmuseum.fi/sv/',
      en: 'https://www.designmuseum.fi/en/',
    },
  },
  {
    name: 'hamhelsinki',
    icon: '/icons/partners/hamhelsinki.png',
    url: {
      fi: 'https://www.hamhelsinki.fi/',
      sv: 'https://www.hamhelsinki.fi/sv/',
      en: 'https://www.hamhelsinki.fi/en/',
    },
  },
  {
    name: 'helsinginkaupunginmuseo',
    icon: '/icons/partners/helsinginkaupunginmuseo.png',
    url: {
      fi: 'https://www.helsinginkaupunginmuseo.fi/',
      sv: 'https://www.helsinginkaupunginmuseo.fi/sv/',
      en: 'https://www.helsinginkaupunginmuseo.fi/en/',
    },
  },
  {
    name: 'helsinginkaupunginorkesteri',
    icon: '/icons/partners/helsinginkaupunginorkesteri.png',
    url: {
      fi: 'https://helsinginkaupunginorkesteri.fi/',
      sv: 'https://helsinginkaupunginorkesteri.fi/sv',
      en: 'https://helsinginkaupunginorkesteri.fi/en',
    },
  },
  {
    name: 'hkt',
    icon: '/icons/partners/hkt.png',
    url: { fi: 'https://hkt.fi/', en: 'https://hkt.fi/hktinenglish/' },
  },
  {
    name: 'hotellijaravintolamuseo',
    icon: '/icons/partners/hotellijaravintolamuseo.png',
    url: {
      fi: 'https://www.hotellijaravintolamuseo.fi/',
      sv: 'https://www.hotellijaravintolamuseo.fi/svenska/',
      en: 'https://www.hotellijaravintolamuseo.fi/english/',
    },
  },
  {
    name: 'hurjaruuth',
    icon: '/icons/partners/hurjaruuth.png',
    url: {
      fi: 'https://www.hurjaruuth.fi/',
      en: 'https://www.hurjaruuth.fi/en/',
    },
  },
  {
    name: 'kaapeli',
    icon: '/icons/partners/Kaapeli.png',
    url: {
      fi: 'https://www.kaapelitehdas.fi/',
      sv: 'https://www.kaapelitehdas.fi/sv',
      en: 'https://www.kaapelitehdas.fi/en',
    },
  },
  {
    name: 'kansallisgalleria',
    icon: '/icons/partners/Finnish_National_Gallery_Logo_FI.svg',
    altLangIcons: {
      en: '/icons/partners/Finnish_National_Gallery_Logo_EN.svg',
      sv: '/icons/partners/Finnish_National_Gallery_Logo_SV.svg',
    },
    url: {
      fi: 'https://www.kansallisgalleria.fi/fi/search?category=artwork&hasImage=true',
      sv: 'https://www.kansallisgalleria.fi/sv/search?category=artwork&hasImage=true',
      en: 'https://www.kansallisgalleria.fi/en/search?category=artwork&hasImage=true',
    },
  },
  {
    name: 'kansallismuseo',
    icon: '/icons/partners/kansallismuseo.png',
    url: { fi: 'https://www.kansallismuseo.fi/fi/kansallismuseo' },
  },
  {
    name: 'kansallisteatteri',
    icon: '/icons/partners/kansallisteatteri.png',
    url: {
      fi: 'https://kansallisteatteri.fi/',
      en: 'https://kansallisteatteri.fi/briefly-in-english/',
    },
  },
  {
    name: 'kulttuuriperintokasvatus',
    icon: '/icons/partners/kulttuuriperintokasvatus.png',
    url: {
      fi: 'https://www.kulttuuriperintokasvatus.fi/',
      sv: 'https://www.kulttuuriperintokasvatus.fi/pa-svenska/',
      en: 'https://www.kulttuuriperintokasvatus.fi/in-english/',
    },
  },
  {
    name: 'tiedemuseoliekki',
    icon: '/icons/partners/Museum_Flame_FI.svg',
    altLangIcons: {
      en: '/icons/partners/Museum_Flame_EN.svg',
      sv: '/icons/partners/Museum_Flame_SV.svg',
    },
    url: {
      fi: 'https://www.helsinki.fi/fi/tiedemuseo-liekki',
      sv: 'https://www.helsinki.fi/sv/vetenskapsmuseet-lagan',
      en: 'https://www.helsinki.fi/en/helsinki-university-museum-flame',
    },
  },
  {
    name: 'mfa',
    icon: '/icons/partners/mfa.png',
    url: { fi: 'https://www.mfa.fi/', en: 'https://www.mfa.fi/en/frontpage/' },
  },
  {
    name: 'nukketeatterisampo',
    icon: '/icons/partners/nukketeatterisampo.png',
    url: {
      fi: 'https://nukketeatterisampo.fi/',
      en: 'https://nukketeatterisampo.fi/en/',
    },
  },
  {
    name: 'oopperabaletti',
    icon: '/icons/partners/oopperabaletti.png',
    url: {
      fi: 'https://oopperabaletti.fi/',
      sv: 'https://oopperabaletti.fi/sv/',
      en: 'https://oopperabaletti.fi/en/',
    },
  },
  {
    name: 'qteatteri',
    icon: '/icons/partners/qteatteri.png',
    url: {
      fi: 'https://www.q-teatteri.fi/',
      en: 'https://www.q-teatteri.fi/q-in-english/',
    },
  },
  {
    name: 'svenskateatern',
    icon: '/icons/partners/svenskateatern.png',
    url: {
      fi: 'https://svenskateatern.fi/fi/alku/',
      sv: 'https://svenskateatern.fi/sv/start/',
      en: 'https://svenskateatern.fi/en/start/',
    },
  },
  {
    name: 'sointijazzorchestra',
    icon: '/icons/partners/sointi_jazz_orchestra.png',
    url: {
      fi: 'https://www.sointijazzorchestra.com/',
      sv: 'https://www.sointijazzorchestra.com/se',
      en: 'https://www.sointijazzorchestra.com/en',
    },
  },
  {
    name: 'tanssintalo',
    icon: '/icons/partners/tanssintalo.png',
    url: {
      fi: 'https://www.tanssintalo.fi/',
      en: 'https://www.tanssintalo.fi/en/',
    },
  },
  {
    name: 'teatteriilmio',
    icon: '/icons/partners/teatteriilmio.png',
    url: { fi: 'https://www.teatteri-ilmio.fi/' },
  },
  {
    name: 'teatterimuseo',
    icon: '/icons/partners/teatterimuseo.png',
    url: {
      fi: 'https://www.teatterimuseo.fi/',
      sv: 'https://www.teatterimuseo.fi/sv',
      en: 'https://www.teatterimuseo.fi/en',
    },
  },
  {
    name: 'valokuvataiteenmuseo',
    icon: '/icons/partners/valokuvataiteenmuseo.png',
    url: {
      fi: 'https://www.valokuvataiteenmuseo.fi/fi',
      sv: 'https://www.valokuvataiteenmuseo.fi/sv',
      en: 'https://www.valokuvataiteenmuseo.fi/en',
    },
  },
  {
    name: 'umo',
    icon: '/icons/partners/umo_logo.png',
    url: {
      fi: 'https://umohelsinki.fi/',
      sv: 'https://umohelsinki.fi/',
      en: 'https://umohelsinki.fi/en',
    },
  },
  {
    name: 'fokus',
    icon: '/icons/partners/fokus_logo.png',
    url: {
      fi: 'https://dialogikasvatus.fi/fokus-ry/etusivu/',
      sv: 'https://dialogikasvatus.fi/fokus-ry/etusivu/',
      en: 'https://dialogikasvatus.fi/fokus-ry/etusivu/',
    },
  },
  {
    name: 'osiris',
    icon: '/icons/partners/osiris_logo.png',
    url: {
      fi: 'https://osiristeatteri.fi/',
      sv: 'https://osiristeatteri.fi/',
      en: 'https://osiristeatteri.fi/en/etusivu/',
    },
  },
];
