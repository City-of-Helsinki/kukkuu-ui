import amosrexIcon from '../../../../assets/icons/partners/amosrex.png';
import cirkoIcon from '../../../../assets/icons/partners/cirko.png';
import designmuseumIcon from '../../../../assets/icons/partners/designmuseum.png';
import dotIcon from '../../../../assets/icons/partners/dotdot.png';
import hamhelsinkiIcon from '../../../../assets/icons/partners/hamhelsinki.png';
import helIcon from '../../../../assets/icons/svg/helsinki-fi.svg';
import helIconSv from '../../../../assets/icons/svg/helsinki-sv.svg';
import helsinginkaupunginmuseoIcon from '../../../../assets/icons/partners/helsinginkaupunginmuseo.png';
import helsinginkaupunginorkesteriIcon from '../../../../assets/icons/partners/helsinginkaupunginorkesteri.png';
import hktIcon from '../../../../assets/icons/partners/hkt.png';
import hotellijaravintolamuseoIcon from '../../../../assets/icons/partners/hotellijaravintolamuseo.png';
import hurjaruuthIcon from '../../../../assets/icons/partners/hurjaruuth.png';
import jaesIcon from '../../../../assets/icons/partners/jaes.png';
import kaapeliIcon from '../../../../assets/icons/partners/Kaapeli.png';
import finnishNationalGalleryIconEN from '../../../../assets/icons/partners/Finnish_National_Gallery_Logo_EN.svg';
import finnishNationalGalleryIconFI from '../../../../assets/icons/partners/Finnish_National_Gallery_Logo_FI.svg';
import finnishNationalGalleryIconSV from '../../../../assets/icons/partners/Finnish_National_Gallery_Logo_SV.svg';
import kansallismuseoIcon from '../../../../assets/icons/partners/kansallismuseo.png';
import kansallisteatteriIcon from '../../../../assets/icons/partners/kansallisteatteri.png';
import kaviIcon from '../../../../assets/icons/partners/kavi.png';
import kulttuuriperintokasvatusIcon from '../../../../assets/icons/partners/kulttuuriperintokasvatus.png';
import mfaIcon from '../../../../assets/icons/partners/mfa.png';
import nukketeatterisampoIcon from '../../../../assets/icons/partners/nukketeatterisampo.png';
import oopperabalettiIcon from '../../../../assets/icons/partners/oopperabaletti.png';
import qteatteriIcon from '../../../../assets/icons/partners/qteatteri.png';
import svenskateaternIcon from '../../../../assets/icons/partners/svenskateatern.png';
import tanssintaloIcon from '../../../../assets/icons/partners/tanssintalo.png';
import teatteriilmioIcon from '../../../../assets/icons/partners/teatteriilmio.png';
import teatterimuseoIcon from '../../../../assets/icons/partners/teatterimuseo.png';
import valokuvataiteenmuseoIcon from '../../../../assets/icons/partners/valokuvataiteenmuseo.png';
import { Partner } from '../types/partner';

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
      fi: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/fi/palvelut/yleiset-kulttuuripalvelut/',
      sv: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/sv/tjanster/allmanna-kulturtjanster/',
      en: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/en/services/cultural-centres-and-support/',
    },
  },
  {
    name: 'jaes',
    icon: jaesIcon,
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
    icon: amosrexIcon,
    url: {
      fi: 'https://amosrex.fi/',
      sv: 'https://amosrex.fi/sv/',
      en: 'https://amosrex.fi/en/',
    },
  },
  {
    name: 'cirko',
    icon: cirkoIcon,
    url: {
      fi: 'https://cirko.fi/',
      sv: 'https://cirko.fi/sv/',
      en: 'https://cirko.fi/en/',
    },
  },
  {
    name: 'dot',
    icon: dotIcon,
    url: {
      fi: 'https://dotdot.fi/suomeksi/',
      sv: 'https://dotdot.fi/start/',
      en: 'https://dotdot.fi/in_english/',
    },
  },
  {
    name: 'designmuseum',
    icon: designmuseumIcon,
    url: {
      fi: 'https://www.designmuseum.fi/fi/',
      sv: 'https://www.designmuseum.fi/sv/',
      en: 'https://www.designmuseum.fi/en/',
    },
  },
  {
    name: 'hamhelsinki',
    icon: hamhelsinkiIcon,
    url: {
      fi: 'https://www.hamhelsinki.fi/',
      sv: 'https://www.hamhelsinki.fi/sv/',
      en: 'https://www.hamhelsinki.fi/en/',
    },
  },
  {
    name: 'helsinginkaupunginmuseo',
    icon: helsinginkaupunginmuseoIcon,
    url: {
      fi: 'https://www.helsinginkaupunginmuseo.fi/',
      sv: 'https://www.helsinginkaupunginmuseo.fi/sv/',
      en: 'https://www.helsinginkaupunginmuseo.fi/en/',
    },
  },
  {
    name: 'helsinginkaupunginorkesteri',
    icon: helsinginkaupunginorkesteriIcon,
    url: {
      fi: 'https://helsinginkaupunginorkesteri.fi/',
      sv: 'https://helsinginkaupunginorkesteri.fi/sv',
      en: 'https://helsinginkaupunginorkesteri.fi/en',
    },
  },
  {
    name: 'hkt',
    icon: hktIcon,
    url: { fi: 'https://hkt.fi/', en: 'https://hkt.fi/hktinenglish/' },
  },
  {
    name: 'hotellijaravintolamuseo',
    icon: hotellijaravintolamuseoIcon,
    url: {
      fi: 'https://www.hotellijaravintolamuseo.fi/',
      sv: 'https://www.hotellijaravintolamuseo.fi/svenska/',
      en: 'https://www.hotellijaravintolamuseo.fi/english/',
    },
  },
  {
    name: 'hurjaruuth',
    icon: hurjaruuthIcon,
    url: {
      fi: 'https://www.hurjaruuth.fi/',
      en: 'https://www.hurjaruuth.fi/en/',
    },
  },
  {
    name: 'kaapeli',
    icon: kaapeliIcon,
    url: {
      fi: 'https://www.kaapelitehdas.fi/',
      sv: 'https://www.kaapelitehdas.fi/sv',
      en: 'https://www.kaapelitehdas.fi/en',
    },
  },
  {
    name: 'kansallisgalleria',
    icon: finnishNationalGalleryIconFI,
    altLangIcons: {
      en: finnishNationalGalleryIconEN,
      sv: finnishNationalGalleryIconSV,
    },
    url: {
      fi: 'https://www.kansallisgalleria.fi/fi/search?category=artwork&hasImage=true',
      sv: 'https://www.kansallisgalleria.fi/sv/search?category=artwork&hasImage=true',
      en: 'https://www.kansallisgalleria.fi/en/search?category=artwork&hasImage=true',
    },
  },
  {
    name: 'kansallismuseo',
    icon: kansallismuseoIcon,
    url: { fi: 'https://www.kansallismuseo.fi/fi/kansallismuseo' },
  },
  {
    name: 'kansallisteatteri',
    icon: kansallisteatteriIcon,
    url: {
      fi: 'https://kansallisteatteri.fi/',
      en: 'https://kansallisteatteri.fi/briefly-in-english/',
    },
  },
  {
    name: 'kavi',
    icon: kaviIcon,
    url: {
      fi: 'https://kavi.fi/kansallinen-audiovisuaalinen-instituutti-palvelee/',
      sv: 'https://kavi.fi/sv/nationella-audiovisuella-institutet/',
      en: 'https://kavi.fi/en/national-audiovisual-institute/',
    },
  },
  {
    name: 'kulttuuriperintokasvatus',
    icon: kulttuuriperintokasvatusIcon,
    url: {
      fi: 'https://www.kulttuuriperintokasvatus.fi/',
      sv: 'https://www.kulttuuriperintokasvatus.fi/pa-svenska/',
      en: 'https://www.kulttuuriperintokasvatus.fi/in-english/',
    },
  },
  {
    name: 'mfa',
    icon: mfaIcon,
    url: { fi: 'https://www.mfa.fi/', en: 'https://www.mfa.fi/en/frontpage/' },
  },
  {
    name: 'nukketeatterisampo',
    icon: nukketeatterisampoIcon,
    url: {
      fi: 'https://nukketeatterisampo.fi/',
      en: 'https://nukketeatterisampo.fi/en/',
    },
  },
  {
    name: 'oopperabaletti',
    icon: oopperabalettiIcon,
    url: {
      fi: 'https://oopperabaletti.fi/',
      sv: 'https://oopperabaletti.fi/sv/',
      en: 'https://oopperabaletti.fi/en/',
    },
  },
  {
    name: 'qteatteri',
    icon: qteatteriIcon,
    url: {
      fi: 'http://www.q-teatteri.fi/',
      en: 'http://www.q-teatteri.fi/q-in-english/',
    },
  },
  {
    name: 'svenskateatern',
    icon: svenskateaternIcon,
    url: {
      fi: 'https://svenskateatern.fi/fi/alku/',
      sv: 'https://svenskateatern.fi/sv/start/',
      en: 'https://svenskateatern.fi/en/start/',
    },
  },
  {
    name: 'tanssintalo',
    icon: tanssintaloIcon,
    url: {
      fi: 'https://www.tanssintalo.fi/',
      en: 'https://www.tanssintalo.fi/en/',
    },
  },
  {
    name: 'teatteriilmio',
    icon: teatteriilmioIcon,
    url: { fi: 'https://www.teatteri-ilmio.fi/' },
  },
  {
    name: 'teatterimuseo',
    icon: teatterimuseoIcon,
    url: {
      fi: 'https://www.teatterimuseo.fi/',
      sv: 'https://www.teatterimuseo.fi/sv',
      en: 'https://www.teatterimuseo.fi/en',
    },
  },
  {
    name: 'valokuvataiteenmuseo',
    icon: valokuvataiteenmuseoIcon,
    url: {
      fi: 'https://www.valokuvataiteenmuseo.fi/fi',
      sv: 'https://www.valokuvataiteenmuseo.fi/sv',
      en: 'https://www.valokuvataiteenmuseo.fi/en',
    },
  },
];
