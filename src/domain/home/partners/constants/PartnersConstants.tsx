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
  { name: 'hel', icon: helIcon, altLangIcons: { sv: helIconSv } },
  { name: 'jaes', icon: jaesIcon },
];

export const partnerList: Partner[] = [
  { name: 'amosrex', icon: amosrexIcon },
  { name: 'cirko', icon: cirkoIcon },
  { name: 'dot', icon: dotIcon },
  { name: 'designmuseum', icon: designmuseumIcon },
  { name: 'hamhelsinki', icon: hamhelsinkiIcon },
  { name: 'helsinginkaupunginmuseo', icon: helsinginkaupunginmuseoIcon },
  {
    name: 'helsinginkaupunginorkesteri',
    icon: helsinginkaupunginorkesteriIcon,
  },
  { name: 'hkt', icon: hktIcon },
  { name: 'hotellijaravintolamuseo', icon: hotellijaravintolamuseoIcon },
  { name: 'hurjaruuth', icon: hurjaruuthIcon },
  {
    name: 'kaapeli',
    icon: kaapeliIcon,
  },
  {
    name: 'kansallisgalleria',
    icon: finnishNationalGalleryIconFI,
    altLangIcons: {
      en: finnishNationalGalleryIconEN,
      sv: finnishNationalGalleryIconSV,
    },
  },
  { name: 'kansallismuseo', icon: kansallismuseoIcon },
  { name: 'kansallisteatteri', icon: kansallisteatteriIcon },
  { name: 'kavi', icon: kaviIcon },
  { name: 'kulttuuriperintokasvatus', icon: kulttuuriperintokasvatusIcon },
  { name: 'mfa', icon: mfaIcon },
  { name: 'nukketeatterisampo', icon: nukketeatterisampoIcon },
  { name: 'oopperabaletti', icon: oopperabalettiIcon },
  { name: 'qteatteri', icon: qteatteriIcon },
  { name: 'svenskateatern', icon: svenskateaternIcon },
  { name: 'tanssintalo', icon: tanssintaloIcon },
  { name: 'teatteriilmio', icon: teatteriilmioIcon },
  { name: 'teatterimuseo', icon: teatterimuseoIcon },
  { name: 'valokuvataiteenmuseo', icon: valokuvataiteenmuseoIcon },
];
