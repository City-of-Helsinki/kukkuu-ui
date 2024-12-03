import { PublicPartnersIconPath } from '../../../../public_files';

export type PartnerIcon =
  | PublicPartnersIconPath // Partner icon path under /public/
  | `data:image/svg+xml;base64${string}`; // Base64 encoded SVG icon

export interface Partner {
  name: string;
  icon: PartnerIcon;
  iconClassName?: string;
  altLangIcons?: { [key: string]: PartnerIcon }; // Icons in other languages
  url: {
    fi: string;
    sv?: string;
    en?: string;
  };
}
